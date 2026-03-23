import { ModuleForm } from "@/components/admin/ModuleForm";

export default function NewModulePage() {
  return (
    <main className="px-4 md:px-8 py-8 pb-24 lg:pb-8 max-w-4xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <a href="/admin/modules" className="text-xs hover:opacity-80" style={{ color: "#6b7280" }}>← Back to Modules</a>
        <h1 className="font-display text-4xl font-bold mt-3 mb-1" style={{ color: "#e8e4d9" }}>New Module</h1>
        <p style={{ color: "#6b7280" }}>Fill in the details below to create a new training module.</p>
      </div>
      <div className="animate-fade-up-2">
        <ModuleForm mode="create" />
      </div>
    </main>
  );
}
