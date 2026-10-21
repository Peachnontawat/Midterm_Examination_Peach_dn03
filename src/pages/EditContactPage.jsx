import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchContact, updateContact } from "../api/contacts";
import { getErrorMessage } from "../api/client";
import PageHeader from "../components/PageHeader";
import ContactForm from "../components/ContactForm";

export default function EditContactPage() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: contact, isPending, isError, error } = useQuery({
    queryKey: ["contacts", contactId],
    queryFn: () => fetchContact(contactId),
  });

  const mutation = useMutation({
    mutationFn: updateContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      navigate("/contacts");
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="แก้ไข Contact" subtitle="แก้ไขข้อมูลของ Contact แล้วบันทึก" />

      {isPending && (
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-12 text-center text-slate-500">
          กำลังโหลดข้อมูล...
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-12 text-center">
          <p className="text-red-600">{getErrorMessage(error, "ไม่พบ Contact นี้")}</p>
          <Link to="/contacts" className="mt-4 inline-block font-medium text-blue-700 hover:underline">
            กลับไปรายการ
          </Link>
        </div>
      )}

      {contact && (
        <ContactForm
          key={contactId}
          initialValues={contact}
          submitLabel="บันทึกการแก้ไข"
          isSubmitting={mutation.isPending}
          serverError={mutation.isError ? getErrorMessage(mutation.error, "บันทึกไม่สำเร็จ") : null}
          onSubmit={(body) => mutation.mutate({ id: contactId, body })}
        />
      )}
    </div>
  );
}
