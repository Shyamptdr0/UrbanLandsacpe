"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  open,
  onOpenChange,
  title = "Confirm Action",
  description = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border border-stone-alt shadow-2xl p-6">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className={`p-2.5 rounded-full ${variant === "danger" ? "bg-red-50 text-red-600 border border-red-200" : "bg-stone-100 text-charcoal"}`}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <DialogTitle className="font-heading text-lg font-medium text-charcoal">{title}</DialogTitle>
          </div>
        </DialogHeader>
        <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{description}</p>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stone-alt">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-stone-alt text-sm font-medium text-charcoal hover:bg-stone-100 rounded-sm"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-sm text-white ${
              variant === "danger" ? "bg-red-600 hover:bg-red-700" : "btn-terra"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
