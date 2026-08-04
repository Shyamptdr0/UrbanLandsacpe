"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const fmt = (n) => "₹ " + (Number(n) || 0).toLocaleString("en-IN");

export default function PaymentCalendar({
  selectedDate,
  onSelectDate,
  installments = [],
  open,
  onOpenChange,
}) {
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [currentMonth, setCurrentMonth] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Map existing installments by date (YYYY-MM-DD)
  const installmentsByDate = {};
  installments.forEach((inst) => {
    if (inst.due_date) {
      const dateKey = inst.due_date.slice(0, 10);
      if (!installmentsByDate[dateKey]) {
        installmentsByDate[dateKey] = [];
      }
      installmentsByDate[dateKey].push(inst);
    }
  });

  const handleDateClick = (dayNum) => {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(dayNum).padStart(2, "0");
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    onSelectDate(dateStr);
    if (onOpenChange) onOpenChange(false);
  };

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
  for (let d = 1; d <= totalDays; d++) daysArray.push(d);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border border-stone-alt shadow-xl p-5 rounded-md">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-stone-alt pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <CalendarIcon size={18} className="text-terracotta" />
            <DialogTitle className="font-heading text-base font-semibold text-charcoal">
              Payment Schedule Calendar
            </DialogTitle>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1 border border-stone-alt hover:bg-stone-100 rounded-sm text-neutral-700"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-heading text-sm font-semibold text-charcoal w-28 text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 border border-stone-alt hover:bg-stone-100 rounded-sm text-neutral-700"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </DialogHeader>

        {/* Legend */}
        <div className="flex items-center justify-between gap-2 text-[11px] bg-[#F9F8F6] px-3 py-2 border border-stone-alt rounded-sm my-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span className="text-neutral-700 font-medium">Paid</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span className="text-neutral-700 font-medium">Pending Due</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-terracotta inline-block" />
            <span className="text-neutral-700 font-medium">Selected Date</span>
          </span>
        </div>

        {/* Compact Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center mt-1">
          {dayNames.map((dn) => (
            <div key={dn} className="text-[11px] font-bold text-neutral-500 py-1 bg-[#F4F3EF] border border-stone-alt rounded-sm">
              {dn}
            </div>
          ))}

          {daysArray.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-11 bg-stone-50/40 border border-stone-100 rounded-sm" />;
            }

            const monthStr = String(month + 1).padStart(2, "0");
            const dayStr = String(day).padStart(2, "0");
            const dateStr = `${year}-${monthStr}-${dayStr}`;
            const existingList = installmentsByDate[dateStr] || [];
            const isSelected = selectedDate === dateStr;
            const isToday = new Date().toISOString().slice(0, 10) === dateStr;

            return (
              <div
                key={dateStr}
                onClick={() => handleDateClick(day)}
                className={`h-11 p-1 border text-left rounded-sm cursor-pointer transition-all flex flex-col justify-between hover:border-terracotta relative overflow-hidden ${
                  isSelected
                    ? "border-terracotta bg-stone-100 ring-2 ring-terracotta/40"
                    : isToday
                    ? "border-neutral-400 bg-stone-50"
                    : "border-stone-alt bg-white hover:bg-[#FDFDFD]"
                }`}
              >
                <div className="flex items-center justify-between leading-none">
                  <span className={`text-xs font-bold ${isSelected ? "text-terracotta" : "text-charcoal"}`}>
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-[8px] font-bold text-neutral-400">TODAY</span>
                  )}
                </div>

                {/* Compact Badges for Existing Installments */}
                <div className="space-y-0.5">
                  {existingList.slice(0, 1).map((inst) => {
                    const isPaid = inst.status === "Paid";
                    return (
                      <div
                        key={inst.id}
                        title={`#${inst.installment_no}: ${fmt(inst.amount)} (${inst.status})`}
                        className={`text-[8px] leading-none px-1 py-0.5 rounded font-semibold truncate flex items-center justify-between ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        <span>#{inst.installment_no}</span>
                        <span>{fmt(inst.amount)}</span>
                      </div>
                    );
                  })}
                  {existingList.length > 1 && (
                    <div className="text-[8px] text-neutral-500 font-bold text-right leading-none">
                      +{existingList.length - 1} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-alt mt-2 text-xs text-neutral-500">
          <span>Click any date to pick installment due date.</span>
          <button
            onClick={() => onOpenChange(false)}
            className="px-3 py-1 border border-stone-alt text-xs font-medium rounded-sm hover:bg-stone-100"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
