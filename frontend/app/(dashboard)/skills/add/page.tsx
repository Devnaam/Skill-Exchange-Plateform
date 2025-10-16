"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

export default function AddSkillPage() {
	const { status } = useSession();
	const router = useRouter();
	const [categories, setCategories] = useState<any[]>([]);
	const [skills, setSkills] = useState<any[]>([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [formData, setFormData] = useState({
		skillId: "",
		skillType: "OFFERED" as "OFFERED" | "WANTED",
		proficiencyLevel: "",
		description: "",
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		} else if (status === "authenticated") {
			loadCategories();
		}
	}, [status]);

	const loadCategories = async () => {
		try {
			// ✅ UPDATED: Use the correct endpoint
			const response = await api.get("/skills/categories");
			console.log("Categories loaded:", response.data); // Debug log
			setCategories(response.data.categories || []);
		} catch (error) {
			console.error("Error loading categories:", error);
			setError("Failed to load categories. Please refresh the page.");
		} finally {
			setLoading(false);
		}
	};

	const loadSkills = async (categoryId: string) => {
		try {
			const response = await api.get(`/skills?categoryId=${categoryId}`);
			setSkills(response.data.skills || []);
		} catch (error) {
			console.error("Error loading skills:", error);
		}
	};

	const handleCategoryChange = (categoryId: string) => {
		setSelectedCategory(categoryId);
		setFormData({ ...formData, skillId: "" });
		if (categoryId) {
			loadSkills(categoryId);
		} else {
			setSkills([]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setError("");
		setSuccess(false);

		try {
			await api.post("/skills/user", formData);
			setSuccess(true);
			setTimeout(() => {
				router.push("/skills");
			}, 1500);
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to add skill");
		} finally {
			setSaving(false);
		}
	};

	if (loading || status === "loading") {
		return (
			<DashboardLayout>
				<div className="flex items-center justify-center min-h-[60vh]">
					<div className="flex flex-col items-center space-y-4">
						<div className="relative">
							<div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
							<div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
						</div>
						<p className="text-slate-600 font-medium">Loading...</p>
					</div>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="max-w-3xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-slate-900">Add New Skill</h1>
						<p className="text-slate-600 mt-1">Expand your skill portfolio</p>
					</div>
					<Button
						onClick={() => router.push("/skills")}
						variant="secondary"
						className="hidden sm:inline-flex"
					>
						Cancel
					</Button>
				</div>

				{/* Success/Error Messages */}
				{success && (
					<div className="bg-green-50 border border-green-200 rounded-lg p-4">
						<div className="flex items-center gap-3">
							<svg
								className="w-5 h-5 text-green-600"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							<p className="text-sm text-green-700 font-medium">
								Skill added successfully! Redirecting...
							</p>
						</div>
					</div>
				)}

				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4">
						<div className="flex items-center gap-3">
							<svg
								className="w-5 h-5 text-red-600"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
							<p className="text-sm text-red-700">{error}</p>
						</div>
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Skill Type Selection */}
					<Card className="border border-slate-200">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-indigo-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
									/>
								</svg>
							</div>
							<div>
								<h2 className="text-xl font-bold text-slate-900">
									What type of skill?
								</h2>
								<p className="text-sm text-slate-600">
									Choose whether you offer or want this skill
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<button
								type="button"
								onClick={() =>
									setFormData({ ...formData, skillType: "OFFERED" })
								}
								className={`p-6 rounded-xl border-2 transition-all text-left ${
									formData.skillType === "OFFERED"
										? "border-indigo-600 bg-indigo-50"
										: "border-slate-200 hover:border-slate-300"
								}`}
							>
								<div className="flex items-center gap-3 mb-3">
									<div
										className={`w-12 h-12 rounded-lg flex items-center justify-center ${
											formData.skillType === "OFFERED"
												? "bg-indigo-600"
												: "bg-slate-100"
										}`}
									>
										<svg
											className={`w-6 h-6 ${
												formData.skillType === "OFFERED"
													? "text-white"
													: "text-slate-600"
											}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="font-bold text-slate-900">I Can Teach</h3>
										<p className="text-xs text-slate-600">Skill I offer</p>
									</div>
								</div>
								<p className="text-sm text-slate-600">
									Add skills you're proficient at and can teach others
								</p>
							</button>

							<button
								type="button"
								onClick={() =>
									setFormData({ ...formData, skillType: "WANTED" })
								}
								className={`p-6 rounded-xl border-2 transition-all text-left ${
									formData.skillType === "WANTED"
										? "border-indigo-600 bg-indigo-50"
										: "border-slate-200 hover:border-slate-300"
								}`}
							>
								<div className="flex items-center gap-3 mb-3">
									<div
										className={`w-12 h-12 rounded-lg flex items-center justify-center ${
											formData.skillType === "WANTED"
												? "bg-indigo-600"
												: "bg-slate-100"
										}`}
									>
										<svg
											className={`w-6 h-6 ${
												formData.skillType === "WANTED"
													? "text-white"
													: "text-slate-600"
											}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
									</div>
									<div>
										<h3 className="font-bold text-slate-900">
											I Want to Learn
										</h3>
										<p className="text-xs text-slate-600">Skill I want</p>
									</div>
								</div>
								<p className="text-sm text-slate-600">
									Add skills you want to learn from others
								</p>
							</button>
						</div>
					</Card>

					{/* Skill Selection */}
					<Card className="border border-slate-200">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-indigo-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
									/>
								</svg>
							</div>
							<div>
								<h2 className="text-xl font-bold text-slate-900">
									Select Skill
								</h2>
								<p className="text-sm text-slate-600">
									Choose category and skill
								</p>
							</div>
						</div>

						<div className="space-y-5">
							<div>
  <label className="block text-sm font-semibold text-slate-900 mb-2">
    Category *
  </label>
  
  {loading ? (
    <div className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500">
      Loading categories...
    </div>
  ) : (
    <select
      required
      value={selectedCategory}
      onChange={(e) => handleCategoryChange(e.target.value)}
      disabled={categories.length === 0}
      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-slate-900 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
    >
      <option value="" disabled>
        {categories.length === 0 ? 'No categories available' : 'Select a category...'}
      </option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.icon ? `${category.icon} ` : ''}{category.name}
        </option>
      ))}
    </select>
  )}
  
  {categories.length === 0 && !loading && (
    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800">
        ⚠️ <strong>No categories found.</strong> Please run the seed command:
      </p>
      <code className="text-xs bg-yellow-100 px-2 py-1 rounded mt-1 inline-block">
        npm run seed
      </code>
    </div>
  )}
</div>


							{selectedCategory && (
								<div>
									<label className="block text-sm font-semibold text-slate-900 mb-2">
										Skill *
									</label>
									<select
										required
										value={formData.skillId}
										onChange={(e) =>
											setFormData({ ...formData, skillId: e.target.value })
										}
										className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-slate-900"
									>
										<option value="">Select a skill...</option>

										{skills.map((skill) => (
											<option key={skill.id} value={skill.id}>
												{skill.name}
											</option>
										))}
									</select>
								</div>
							)}

							{formData.skillType === "OFFERED" && (
								<div>
									<label className="block text-sm font-semibold text-slate-900 mb-2">
										Proficiency Level
									</label>
									<select
										value={formData.proficiencyLevel}
										onChange={(e) =>
											setFormData({
												...formData,
												proficiencyLevel: e.target.value,
											})
										}
										className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-slate-900"
									>
										<option value="">Select level (optional)</option>
										<option value="BEGINNER">Beginner</option>
										<option value="INTERMEDIATE">Intermediate</option>
										<option value="ADVANCED">Advanced</option>
										<option value="EXPERT">Expert</option>
									</select>
								</div>
							)}

							<div>
								<label className="block text-sm font-semibold text-slate-900 mb-2">
									Description (Optional)
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									rows={4}
									className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-slate-900 resize-none"
									placeholder="Add details about your experience or learning goals..."
								/>
								<p className="text-xs text-slate-500 mt-1">
									{formData.skillType === "OFFERED"
										? "Share your experience or what you can teach"
										: "Explain what you want to learn and why"}
								</p>
							</div>
						</div>
					</Card>

					{/* Action Buttons */}
					<div className="flex flex-col-reverse sm:flex-row items-center gap-3">
						<Button
							type="button"
							onClick={() => router.push("/skills")}
							variant="secondary"
							className="w-full sm:w-auto"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={saving || !formData.skillId}
							variant="primary"
							className="w-full sm:flex-1 sm:max-w-xs"
						>
							{saving ? (
								<span className="flex items-center justify-center gap-2">
									<svg
										className="animate-spin h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Adding skill...
								</span>
							) : (
								"Add Skill"
							)}
						</Button>
					</div>
				</form>
			</div>
		</DashboardLayout>
	);
}
