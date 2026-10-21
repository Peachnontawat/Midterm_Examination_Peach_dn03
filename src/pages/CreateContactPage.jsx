import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContact } from "../api/contacts";
import { getErrorMessage } from "../api/client";
import PageHeader from "../components/PageHeader";
import ContactForm from "../components/ContactForm";

export default function CreateContactPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      navigate("/contacts");
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="สร้าง Contact ใหม่" subtitle="กรอกข้อมูลของ Contact ที่ต้องการบันทึก" />
      <ContactForm
        submitLabel="สร้าง Contact"
        isSubmitting={mutation.isPending}
        serverError={mutation.isError ? getErrorMessage(mutation.error, "สร้าง Contact ไม่สำเร็จ") : null}
        onSubmit={(body) => mutation.mutate(body)}
      />
    </div>
  );
}
