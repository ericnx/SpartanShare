import React, { useRef, useEffect } from "react";

type NewProjectModalProps = {
  onClose: () => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function NewProjectModal({
  onClose,
  onSubmit,
}: NewProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-gray-100 border-2 border-black w-[600px] rounded-md shadow-lg"
      >
        <h2 className="text-center text-lg font-bold bg-sky-200 py-0.5 border-b-2 border-black rounded">
          New Project
        </h2>

        <form
          className="space-y-5 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.(e);
          }}
        >
          <div className="flex justify-between">
            <label className="w-1/4 font-semibold">Enter Title:</label>
            <input
              type="text"
              placeholder="Title"
              className="w-3/4 border border-black rounded px-2 py-1"
            />
          </div>

          <div className="flex justify-between">
            <label className="w-1/4 font-semibold">Enter Description:</label>
            <textarea
              placeholder="Description"
              className="w-3/4 border border-black rounded px-2 py-1 h-24"
            />
          </div>

          <div className="flex justify-between">
            <label className="w-1/3 font-semibold">Start and End Date:</label>
            <div className="w-2/3 flex gap-2">
              <input type="date" className="border border-black rounded px-2" />
              <input type="date" className="border border-black rounded px-2" />
            </div>
          </div>

          <div className="flex justify-between">
            <label className="w-1/4 font-semibold">Skills Wanted:</label>
            <input
              type="text"
              placeholder="Skills"
              className="w-3/4 border border-black rounded px-2 py-1 h-12"
            />
          </div>

          <div className="flex justify-between">
            <label className="w-1/4 font-semibold">Graduate Level:</label>
            <select className="w-3/4 border border-black rounded px-2 py-1">
              <option value="" disabled hidden>
                Select Level
              </option>
              <option>Undergrad/Grad</option>
              <option>Undergrad</option>
              <option>Graduate</option>
            </select>
          </div>

          <div className="flex justify-between">
            <label className="w-1/4 font-semibold">Majors Wanted:</label>
            <select className="w-3/4 border border-black rounded px-2 py-1">
              <option value="" disabled hidden>
                Select Majors
              </option>
              <option>Computer Science</option>
              <option>Software Engr</option>
              <option>Computer Engr</option>
              <option>Mechanical Engr</option>
            </select>
          </div>

          <div className="flex justify-center gap-24 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-0.5 border border-black bg-gray-200 hover:bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 border border-black bg-gray-200 hover:bg-gray-300 rounded"
            >
              Post Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
