import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteContact, fetchContacts, getContactId } from "../api/contacts";
import { getErrorMessage } from "../api/client";
import PageHeader from "../components/PageHeader";
import ConfirmDialog from "../components/ConfirmDialog";
import { PencilIcon, PlusIcon, TrashIcon } from "../components/Icons";

function fullName(contact) {
  return [contact.firstName, contact.lastName].filter(Boolean).join(" ");
}

function Cell({ children }) {
  return (
    <td className="px-6 py-6 text-slate-900">
      {children || <span className="text-slate-400">-</span>}
    </td>
  );
}

export default function ContactListPage() {
  const queryClient = useQueryClient();
  const [toDelete, setToDelete] = useState(null);

  const {
    data: contacts = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
  });

  const removeMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setToDelete(null);
    },
  });

  const closeDialog = () => {
    setToDelete(null);
    removeMutation.reset();
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          title="Contact Demo"
          subtitle="สร้าง แก้ไข และลบ Contact ของคุณ"
        />
        <Link
          to="/contacts/create"
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-medium text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <PlusIcon />
          สร้าง Contact
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left">
            <thead className="bg-slate-100 text-sm font-semibold text-slate-600">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">
                  <span className="sr-only">การจัดการ</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isPending && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-red-600">
                      {getErrorMessage(error, "โหลดข้อมูลไม่สำเร็จ")}
                    </p>
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-3 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                      ลองอีกครั้ง
                    </button>
                  </td>
                </tr>
              )}

              {!isPending && !isError && contacts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    ยังไม่มี Contact กด “สร้าง Contact” เพื่อเพิ่มรายการแรก
                  </td>
                </tr>
              )}

              {contacts.map((contact) => {
                const id = getContactId(contact);
                const name = fullName(contact);
                return (
                  <tr key={id} className="transition hover:bg-slate-50/60">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-50 font-semibold text-teal-800">
                          {(contact.firstName || "?").charAt(0).toUpperCase()}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {name}
                        </span>
                      </div>
                    </td>
                    <Cell>{contact.email}</Cell>
                    <Cell>{contact.phone}</Cell>
                    <Cell>{contact.company}</Cell>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/contacts/edit/${id}`}
                          aria-label={`แก้ไข ${name}`}
                          className="grid size-14 place-items-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <PencilIcon className="size-6" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(contact)}
                          aria-label={`ลบ ${name}`}
                          className="grid size-14 place-items-center rounded-lg border border-slate-200 text-red-700 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                        >
                          <TrashIcon className="size-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="ลบ Contact นี้?"
        message={toDelete ? `“${fullName(toDelete)}” จะถูกลบถาวร` : ""}
        confirmLabel="ลบ"
        isLoading={removeMutation.isPending}
        error={
          removeMutation.isError
            ? getErrorMessage(removeMutation.error, "ลบไม่สำเร็จ")
            : null
        }
        onConfirm={() => removeMutation.mutate(getContactId(toDelete))}
        onCancel={closeDialog}
      />
    </>
  );
}
