"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Sparkles, ArrowRight, Briefcase, MapPin, DollarSign, Clock, Send, Search, X, Paperclip, Upload, Loader2, Sparkle, Link as LinkIcon } from "lucide-react";

const openRoles = [
  {
    title: "Senior Next.js & AI Engineer",
    department: "Engineering",
    location: "Remote / Lahore",
    type: "Full-time",
    salary: "$80k - $120k",
    description: "Lead the architectural development of high-performance Next.js web applications and autonomous AI agent workflows for our global enterprise clients.",
    tags: ["Next.js 15", "React", "TypeScript", "Python", "AI LLMs"]
  },
  {
    title: "UI/UX Design Director",
    department: "Design",
    location: "Remote / Lahore",
    type: "Full-time",
    salary: "$70k - $100k",
    description: "Shape the visual direction, design systems, and conversion-optimized user experiences across all Voquarn Code products and marketing surfaces.",
    tags: ["Figma", "Design Systems", "Prototyping", "Tailwind CSS"]
  },
  {
    title: "Growth & Technical SEO Lead",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$60k - $90k",
    description: "Drive organic acquisition strategies, technical site audits, schema architectures, and high-intent funnel optimizations for fast-growing brands.",
    tags: ["Technical SEO", "Ahrefs", "Google Analytics", "Conversion Rate"]
  },
  {
    title: "Full Stack Supabase Architect",
    department: "Engineering",
    location: "Remote",
    type: "Contract / Full-time",
    salary: "$75k - $110k",
    description: "Design secure multi-tenant database schemas, row-level security policies, and real-time backend integrations for our custom SaaS platforms.",
    tags: ["Supabase", "PostgreSQL", "Node.js", "Edge Functions"]
  }
];

export default function CareersPage() {
  const departments = ["All", ...Array.from(new Set(openRoles.map((r) => r.department)))];
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Form state for application modal
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMsg, setSubmitMsg] = useState("");

  const filtered = openRoles.filter((role) => {
    const matchesTag = activeTag === "All" || role.department === activeTag;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      role.title.toLowerCase().includes(q) ||
      role.department.toLowerCase().includes(q) ||
      role.tags.some((t) => t.toLowerCase().includes(q));
    return matchesTag && matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setApplicantName("");
    setApplicantEmail("");
    setApplicantPhone("");
    setGithubUrl("");
    setPortfolioUrl("");
    setSelectedFile(null);
    setFileBase64("");
    setSubmitStatus("idle");
    setSubmitMsg("");
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone || !selectedFile) {
      alert("Name, email, mobile number, and CV file are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: applicantName,
          email: applicantEmail,
          phone: applicantPhone,
          role: selectedRole,
          github: githubUrl || undefined,
          website: portfolioUrl || undefined,
          fileData: fileBase64,
          fileName: selectedFile.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMsg("Application and CV successfully submitted via email!");
      } else {
        setSubmitStatus("error");
        setSubmitMsg(data.message || "Failed to submit application.");
      }
    } catch (err: any) {
      setSubmitStatus("error");
      setSubmitMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <SectionHeading
          eyebrow="Careers"
          title="Build elite digital systems without corporate bureaucracy"
          description="We are looking for elite practitioners who take immense pride in their craft. No endless meetings, no office politics—just disciplined execution and high-impact shipping."
        />

        {/* Search Bar + Filter Tags (Centered Perfectly) */}
        <div className="mt-14 flex flex-col items-center justify-center gap-5 text-center w-full">
          {/* Search Input */}
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none stroke-[2]" />
            <input
              type="text"
              placeholder="Search roles, skills, departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-full border border-neutral-300 bg-white text-sm font-semibold text-neutral-900 placeholder-neutral-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff5400]/30 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#ff5400] transition-colors"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            )}
          </div>

          {/* Department Filter Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setActiveTag(dept)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  activeTag === dept
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 hover:text-black"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Open Roles Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-12">
            <div>
              <h3 className="font-display text-3xl font-black text-neutral-900 tracking-tight">Open Positions</h3>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-bold">
                {filtered.length} {filtered.length === 1 ? "Role" : "Roles"} Available
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-[#ff5400]/10 border border-[#ff5400]/20 px-4 py-2 rounded-full text-[#ff5400] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Fast 48-Hour Interview Process
            </div>
          </div>

          <div className="space-y-6">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-neutral-400">
                <Search className="w-10 h-10 mx-auto mb-4 opacity-40" />
                <p className="text-lg font-semibold">No roles found</p>
                <p className="text-sm mt-1">Try a different search or filter</p>
              </div>
            ) : filtered.map((role) => (
              <article 
                key={role.title} 
                className="bg-white border border-neutral-200 rounded-[2.5rem] p-8 sm:p-10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-8"
              >
                <div className="space-y-4 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
                    <span className="text-[#ff5400] bg-[#ff5400]/10 px-3 py-1 rounded-full border border-[#ff5400]/20">{role.department}</span>
                    <span className="text-neutral-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-neutral-400 stroke-[2]" /> {role.location}</span>
                    <span className="text-neutral-600 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-neutral-400 stroke-[2]" /> {role.type}</span>
                    <span className="text-neutral-900 font-bold flex items-center gap-0.5 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200"><DollarSign className="w-3.5 h-3.5 text-[#ff5400] stroke-[2]" /> {role.salary}</span>
                  </div>

                  <h4 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">{role.title}</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed font-semibold">{role.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {role.tags.map((t) => (
                      <span key={t} className="bg-white text-neutral-700 text-[10px] font-bold px-3 py-1 rounded-full border border-neutral-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                  <button
                    onClick={() => {
                      setSelectedRole(role.title);
                      resetForm();
                    }}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#ff5400] shadow-md hover:shadow-xl transition-all hover:scale-105"
                  >
                    <Send className="w-4 h-4" /> <span>Apply for Role</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Spontaneous Application CTA */}
      <section className="page-section pt-16">
        <div className="rounded-[2.5rem] border border-neutral-900 bg-neutral-900 p-10 sm:p-14 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff5400]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5400]/20 border border-[#ff5400]/30 text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <Briefcase className="w-3.5 h-3.5 text-[#ff5400]" /> Spontaneous Application
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Don&apos;t see your exact role listed above?
            </h2>
            <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-semibold">
              We always make room for world-class talent. Send us your GitHub, Figma portfolio, or past project links directly. If your work is exceptional, we will create a role for you.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex-shrink-0">
            <button
              onClick={() => {
                setSelectedRole("Spontaneous Application / General Talent");
                resetForm();
              }}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5400] px-8 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#e04800] shadow-xl transition-all hover:scale-105"
            >
              <span>Send Portfolio Directly</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* --- PREMIUM COMPACT APPLY MODAL --- */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            className="w-full max-w-[480px] bg-white border border-neutral-200 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col p-6 sm:p-8 animate-slide-up"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedRole(null)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors border border-neutral-300"
            >
              <X className="w-4 h-4 text-neutral-900 stroke-[2]" />
            </button>

            {submitStatus === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8 animate-in fade-in zoom-in-95 duration-500">
                {/* Dynamic Illustration (blob, envelope, sliding document, sparkles) */}
                <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                  
                  {/* Light blue soft background blob */}
                  <div className="absolute inset-4 bg-[#eff6ff] rounded-full blur-xl opacity-70 animate-pulse duration-[3000ms]" />
                  
                  {/* Floating blue stars */}
                  <div className="absolute top-2 left-6 animate-bounce" style={{ animationDuration: '4s' }}>
                    <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-4 right-6 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                    <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>
                    </svg>
                  </div>
                  <div className="absolute top-1/2 -right-2 animate-ping" style={{ animationDuration: '2.5s' }}>
                    <svg className="w-2.5 h-2.5 text-blue-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-6 left-8 animate-pulse">
                    <svg className="w-3 h-3 text-blue-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>
                    </svg>
                  </div>
                  <div className="absolute top-6 right-8 animate-pulse" style={{ animationDelay: '1s' }}>
                    <svg className="w-2 h-2 text-blue-300 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>
                    </svg>
                  </div>

                  {/* Envelope Container */}
                  <div className="relative z-10 w-28 h-28 flex items-center justify-center">
                    {/* Back Flap */}
                    <div className="absolute bottom-2 w-24 h-16 bg-blue-100 rounded-lg border-2 border-blue-200 flex items-end justify-center shadow-inner overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-t from-blue-50 to-transparent absolute inset-0" />
                      <div className="w-24 h-24 bg-blue-200/50 rotate-45 transform translate-y-8 absolute" />
                    </div>

                    {/* Checked Document sliding out */}
                    <div className="absolute bottom-5 w-16 h-20 bg-white rounded-md border border-blue-300 shadow-md flex items-center justify-center p-2.5 animate-[bounce_3s_infinite]">
                      <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/30">
                        <svg className="w-5 h-5 text-white stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Front Flap */}
                    <div className="absolute bottom-2 w-24 h-10 bg-gradient-to-t from-blue-200 to-blue-100/90 rounded-b-lg border-x-2 border-b-2 border-blue-200 shadow-sm flex items-center justify-center overflow-hidden">
                      <div className="w-24 h-24 bg-blue-100 rotate-45 transform translate-y-6 absolute border border-blue-200" />
                    </div>
                  </div>
                </div>

                {/* Text Messages */}
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 leading-tight mb-3">
                  Thank you for your submission!
                </h3>
                <p className="text-xs text-neutral-500 font-semibold leading-relaxed px-4 mb-8 max-w-sm">
                  We have received your resume for the <strong>{selectedRole}</strong> position. 
                  Our team makes interview selection decisions in 48 hours.
                </p>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setSelectedRole(null);
                    resetForm();
                  }}
                  className="w-full py-4 rounded-xl bg-neutral-950 hover:bg-[#ff5400] text-white text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg hover:scale-[1.02]"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                {/* Header Content (Super-Compact) */}
                <div className="text-center mt-2 mb-4">
                  <h3 className="text-2xl font-black tracking-tight text-neutral-900 leading-tight">
                    Submit Your CV / Resume
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-600 font-semibold px-2">
                    Join our elite team. Enter your details and upload your resume to apply.
                  </p>
                  <div className="mt-2.5 inline-block px-3.5 py-1 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/20 text-[10px] font-bold text-[#ff5400] uppercase tracking-wider">
                    Role: {selectedRole}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleApplySubmit} className="space-y-3.5">
                  {/* Core Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-800 uppercase tracking-wider mb-1 pl-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-950 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff5400]/25 focus:border-[#ff5400]/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-800 uppercase tracking-wider mb-1 pl-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-950 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff5400]/25 focus:border-[#ff5400]/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-800 uppercase tracking-wider mb-1 pl-1">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +92 324 1940988"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-950 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff5400]/25 focus:border-[#ff5400]/50 transition-all"
                    />
                  </div>

                  {/* Links - Optional */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-800 uppercase tracking-wider mb-1 pl-1 flex items-center gap-1">
                        <svg className="w-3 h-3 text-neutral-500 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                        GitHub URL <span className="text-[8px] text-neutral-500 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-950 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff5400]/25 focus:border-[#ff5400]/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-800 uppercase tracking-wider mb-1 pl-1 flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-neutral-500 stroke-[2.5]" /> Website <span className="text-[8px] text-neutral-500 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://myportfolio.com"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-950 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff5400]/25 focus:border-[#ff5400]/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* CV Uploader */}
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-800 uppercase tracking-wider mb-1 pl-1">Upload CV / Resume *</label>
                    <div className="border border-dashed border-neutral-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white hover:bg-neutral-50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        required
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-5 h-5 text-neutral-700 mb-1.5 stroke-[2]" />
                      <span className="text-xs font-bold text-neutral-900">
                        {selectedFile ? selectedFile.name : "Choose PDF / Word File"}
                      </span>
                      <span className="text-[9px] text-neutral-500 font-bold mt-0.5">Max size: 5MB</span>
                    </div>
                  </div>

                  {/* Response Messages */}
                  {submitStatus === "error" && (
                    <div className="p-2.5 rounded-xl text-center text-xs font-bold bg-red-50 text-red-800 border border-red-200">
                      {submitMsg}
                    </div>
                  )}

                  {/* Modal Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(null)}
                      className="w-1/2 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 text-xs font-bold tracking-wider transition-colors"
                    >
                      Maybe later
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedFile}
                      className="w-1/2 py-3 rounded-xl bg-[#ff5400] hover:bg-[#e04800] text-white text-xs font-black tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <span>Apply Now</span>
                          <Sparkle className="w-3 h-3 fill-current text-white animate-pulse" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
