import React from "react";

type ProjectCardProps = {
  id: number | string;
  title: string;
  majors: string[];
  skills: string[];
  duration: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ProjectCard({
  id,
  title,
  majors,
  skills,
  duration,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <div className="w-64 border border-black shadow-sm" key={id}>
      <div className="bg-sky-200 px-2 py-1 border-b border-black text-center font-bold">
        {title}
      </div>

      <div className="p-3 text-sm space-y-3">
        <div className="flex">
          <span className="font-semibold w-20 shrink-0">Majors:</span>
          <span className="whitespace-pre-wrap">{majors.join(", ")}</span>
        </div>
        <div className="flex">
          <span className="font-semibold w-20 shrink-0">Skills:</span>
          <span className="whitespace-pre-wrap">{skills.join(", ")}</span>
        </div>
        <div className="flex">
          <span className="font-semibold w-20 shrink-0">Duration:</span>
          <span className="whitespace-pre-wrap">{duration}</span>
        </div>
      </div>

      <div className="flex justify-between px-3 pb-3">
        <button
          className="text-blue-600 font-semibold hover:underline"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="text-red-600 font-semibold hover:underline"
          onClick={onDelete}
        >
          Delete Project
        </button>
      </div>
    </div>
  );
}
