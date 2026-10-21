import { ContactIcon } from "./Icons";

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-800">
        <ContactIcon className="size-7" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-0.5 text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
