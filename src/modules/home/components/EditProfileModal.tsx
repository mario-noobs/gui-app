import { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import Modal from "./Modal";
import { IUserProfile } from "../../auth/models/auth";
import { COUNTRIES, GENDER_OPTIONS } from "../constants/countries";

interface EditProfileFormData {
  first_name: string;
  last_name: string;
  phone: string;
  profile?: Partial<IUserProfile>;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EditProfileFormData) => Promise<void>;
  initialData: EditProfileFormData;
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 hover:bg-white";

const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 hover:bg-white appearance-none";

type TabKey = "personal" | "address";

export default function EditProfileModal({ open, onClose, onSave, initialData }: EditProfileModalProps) {
  const [form, setForm] = useState<EditProfileFormData>(initialData);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("personal");

  useEffect(() => {
    if (open) {
      setForm(initialData);
      setActiveTab("personal");
    }
  }, [open, initialData]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateProfileField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "personal", label: "Personal Info" },
    { key: "address", label: "Address" },
  ];

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
            <p className="text-sm text-gray-500">Update your personal information</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-sm font-medium py-2 px-4 rounded-lg transition-all ${
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4 min-h-[280px]">
          {activeTab === "personal" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => updateField("first_name", e.target.value)}
                    className={inputClass}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => updateField("last_name", e.target.value)}
                    className={inputClass}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={inputClass}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={form.profile?.display_name || ""}
                    onChange={(e) => updateProfileField("display_name", e.target.value)}
                    className={inputClass}
                    placeholder="Enter display name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                  <select
                    value={form.profile?.gender || ""}
                    onChange={(e) => updateProfileField("gender", e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select gender</option>
                    {GENDER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={form.profile?.date_of_birth || ""}
                    onChange={(e) => updateProfileField("date_of_birth", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea
                  value={form.profile?.bio || ""}
                  onChange={(e) => updateProfileField("bio", e.target.value)}
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="Tell us about yourself"
                />
              </div>
            </>
          )}

          {activeTab === "address" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 1</label>
                <input
                  type="text"
                  value={form.profile?.address_line_1 || ""}
                  onChange={(e) => updateProfileField("address_line_1", e.target.value)}
                  className={inputClass}
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 2</label>
                <input
                  type="text"
                  value={form.profile?.address_line_2 || ""}
                  onChange={(e) => updateProfileField("address_line_2", e.target.value)}
                  className={inputClass}
                  placeholder="Apartment, suite, unit, etc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={form.profile?.city || ""}
                    onChange={(e) => updateProfileField("city", e.target.value)}
                    className={inputClass}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                  <input
                    type="text"
                    value={form.profile?.state || ""}
                    onChange={(e) => updateProfileField("state", e.target.value)}
                    className={inputClass}
                    placeholder="Enter state"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                  <input
                    type="text"
                    value={form.profile?.postal_code || ""}
                    onChange={(e) => updateProfileField("postal_code", e.target.value)}
                    className={inputClass}
                    placeholder="Enter postal code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                  <select
                    value={form.profile?.country || ""}
                    onChange={(e) => updateProfileField("country", e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <Button
            onClick={handleSave}
            loading={saving}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium normal-case shadow-none hover:shadow-md transition-all"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
