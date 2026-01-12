"use client";

import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Hash,
  Save,
  Loader2,
  Clock,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

// Constants & Actions
import { FARM_TYPES, NIGERIAN_STATES, DAYS_OF_WEEK } from "@/lib/constants";
import {
  getFarmerSettings,
  updateFarmerSettings,
} from "@/lib/actions/user.actions";

export function SettingsPage() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAllStates, setShowAllStates] = useState(false);
  const [formData, setFormData] = useState<any>({
    farmTypes: [],
    locations: [],
    availability: { days: [] },
  });

  useEffect(() => {
    async function load() {
      if (session?.user?.id) {
        const data = await getFarmerSettings(session.user.id);
        setFormData(data);
        setIsLoading(false);
      }
    }
    load();
  }, [session]);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateFarmerSettings(session?.user?.id!, formData);
    if (result.success) {
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.fullName,
          username: formData.username,
        },
      });
      toast.success("Profile Synchronized!");
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (isLoading)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-emerald-600 font-bold">
        <Loader2 className="animate-spin" /> Fetching Profile...
      </div>
    );

  return (
    <div className="settings-container">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black">Settings</h1>
          <p className="text-slate-500 text-sm">
            Manage your identity and farm setup
          </p>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`px-8 py-3 rounded-2xl font-bold cursor-pointer shadow-lg transition-all active:scale-95 ${
            isEditing
              ? "bg-emerald-600 text-white"
              : "bg-white text-slate-700 border"
          }`}
        >
          {isSaving ? (
            "Saving..."
          ) : isEditing ? (
            <>
              <Save className="inline w-4 h-4 mr-2" /> Save
            </>
          ) : (
            "Edit Profile"
          )}
        </button>
      </div>

      {/* SECTION 1: PERSONAL */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="p-2 bg-blue-50 rounded-xl">
            <User className="text-blue-600 w-5 h-5" />
          </div>
          <h3 className="font-bold">Personal Information</h3>
        </div>
        <div className="settings-card-content grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputItem
            label="Full Name"
            value={formData.fullName}
            disabled={!isEditing}
            icon={<User size={12} />}
            onChange={(v: string) => setFormData({ ...formData, fullName: v })}
          />
          <InputItem
            label="Username"
            value={formData.username}
            disabled={!isEditing}
            icon={<Hash size={12} />}
            onChange={(v: string) => setFormData({ ...formData, username: v })}
          />
          <InputItem
            label="Email"
            value={formData.email}
            disabled={true}
            icon={<Mail size={12} />}
          />
          <InputItem
            label="Phone"
            value={formData.phone}
            disabled={!isEditing}
            icon={<Phone size={12} />}
            onChange={(v: string) => setFormData({ ...formData, phone: v })}
          />
        </div>
      </div>

      {/* SECTION 2: FARM */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <MapPin className="text-emerald-600 w-5 h-5" />
          </div>
          <h3 className="font-bold">Farm Configuration</h3>
        </div>
        <div className="settings-card-content space-y-8">
          <InputItem
            label="Farm Name"
            value={formData.farmName}
            disabled={!isEditing}
            onChange={(v: string) => setFormData({ ...formData, farmName: v })}
          />

          {/* Farm Types Multi-Select */}
          <div className="space-y-3">
            <label className="settings-label">Produce Categories (Max 5)</label>
            <div className="flex flex-wrap gap-2">
              {FARM_TYPES.map((type) => (
                <button
                  key={type}
                  disabled={!isEditing}
                  onClick={() => {
                    const types = formData.farmTypes.includes(type)
                      ? formData.farmTypes.filter((t: string) => t !== type)
                      : [...formData.farmTypes, type];
                    setFormData({ ...formData, farmTypes: types });
                  }}
                  className={`px-4 py-2 cursor-pointer rounded-2xl text-[13px] font-bold border transition-all ${
                    formData.farmTypes.includes(type)
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-50 text-slate-400 border-transparent"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Locations Multi-Select */}
          <div className="space-y-3">
            <label className="settings-label">
              Locations of States (Max 5)
            </label>
            <div className="flex flex-wrap gap-2">
              {(showAllStates
                ? NIGERIAN_STATES
                : NIGERIAN_STATES.slice(0, 8)
              ).map((state) => (
                <button
                  key={state}
                  disabled={!isEditing}
                  onClick={() => {
                    const locs = formData.locations.includes(state)
                      ? formData.locations.filter((l: string) => l !== state)
                      : [...formData.locations, state];
                    setFormData({ ...formData, locations: locs });
                  }}
                  className={`px-4 py-2 rounded-2xl cursor-pointer text-[13px] font-bold border transition-all ${
                    formData.locations.includes(state)
                      ? "bg-slate-800 text-white"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  {state}
                </button>
              ))}
              {isEditing && (
                <button
                  onClick={() => setShowAllStates(!showAllStates)}
                  className="text-[14px] cursor-pointer font-bold text-emerald-600 px-2"
                >
                  {showAllStates ? "Less" : "Show All States"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: AVAILABILITY */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="p-2 bg-amber-50 rounded-xl">
            <Clock className="text-amber-600 w-5 h-5" />
          </div>
          <h3 className="font-bold">Business Hours</h3>
        </div>
        <div className="settings-card-content space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <InputItem
              type="time"
              label="Opens"
              value={formData.availability?.startTime}
              disabled={!isEditing}
              onChange={(v: string) =>
                setFormData({
                  ...formData,
                  availability: { ...formData.availability, startTime: v },
                })
              }
            />
            <InputItem
              type="time"
              label="Closes"
              value={formData.availability?.endTime}
              disabled={!isEditing}
              onChange={(v: string) =>
                setFormData({
                  ...formData,
                  availability: { ...formData.availability, endTime: v },
                })
              }
            />
          </div>

          <div className="space-y-3">
            <label className="settings-label">Working Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day}
                  disabled={!isEditing}
                  onClick={() => {
                    const days = formData.availability.days.includes(day)
                      ? formData.availability.days.filter(
                          (d: string) => d !== day
                        )
                      : [...formData.availability.days, day];
                    setFormData({
                      ...formData,
                      availability: { ...formData.availability, days },
                    });
                  }}
                  className={`px-4 py-2 cursor-pointer rounded-2xl text-[13px] font-bold border transition-all ${
                    formData.availability.days.includes(day)
                      ? "bg-amber-500 text-white"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENT (Internal)
function InputItem({
  label,
  value,
  disabled,
  icon,
  onChange,
  type = "text",
}: any) {
  return (
    <div className="space-y-2">
      <label className="settings-label">
        {icon} {label}
      </label>
      <input
        type={type}
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="settings-input"
      />
    </div>
  );
}
