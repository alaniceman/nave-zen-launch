import { useMemo, useState } from "react";
import { Check, ChevronDown, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { coaches } from "@/data/coaches";
import { resolveCoachId } from "@/lib/coachSync";
import { cn } from "@/lib/utils";

interface ProfessionalOption {
  id: string;
  name: string;
  slug: string;
}

interface ProfessionalPickerProps {
  professionals: ProfessionalOption[];
  value: string;
  onValueChange: (value: string) => void;
}

const initialsFor = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

function imageFor(professional: ProfessionalOption) {
  const coachId = resolveCoachId(professional.name);
  const coach = coaches.find(
    (item) => item.id === coachId || item.slug === professional.slug,
  );
  return coach?.image;
}

export function ProfessionalPicker({
  professionals,
  value,
  onValueChange,
}: ProfessionalPickerProps) {
  const [expanded, setExpanded] = useState(false);
  const selected = professionals.find((professional) => professional.id === value);
  const previewProfessionals = useMemo(() => professionals.slice(0, 5), [professionals]);

  const selectProfessional = (nextValue: string) => {
    onValueChange(nextValue);
    setExpanded(false);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <Button
        type="button"
        variant="ghost"
        onClick={() => setExpanded((current) => !current)}
        className="h-auto min-h-16 w-full justify-start rounded-none px-3 py-3 hover:bg-muted/60"
        aria-expanded={expanded}
        aria-controls="professional-options"
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">
          {selected ? (
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm ring-1 ring-border">
              <AvatarImage src={imageFor(selected)} alt={selected.name} className="object-cover" />
              <AvatarFallback className="text-xs font-semibold">{initialsFor(selected.name)}</AvatarFallback>
            </Avatar>
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Users className="h-5 w-5" />
            </span>
          )}

          <span className="min-w-0 text-left">
            <span className="block text-xs text-muted-foreground">Instructor</span>
            <span className="block truncate text-sm font-semibold text-foreground">
              {selected?.name ?? "Cualquiera"}
            </span>
          </span>

          {!selected && !expanded && professionals.length > 0 && (
            <span className="ml-auto flex items-center -space-x-2" aria-hidden="true">
              {previewProfessionals.map((professional, index) => (
                <Avatar
                  key={professional.id}
                  className={cn("h-7 w-7 border-2 border-background sm:h-8 sm:w-8", index >= 3 && "hidden sm:flex")}
                >
                  <AvatarImage src={imageFor(professional)} alt="" className="object-cover" />
                  <AvatarFallback className="text-[9px] font-semibold">
                    {initialsFor(professional.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {professionals.length > 3 && (
                <span className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-foreground text-[9px] font-bold text-background sm:hidden">
                  +{professionals.length - 3}
                </span>
              )}
              {professionals.length > previewProfessionals.length && (
                <span className="relative hidden h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-foreground text-[10px] font-bold text-background sm:flex">
                  +{professionals.length - previewProfessionals.length}
                </span>
              )}
            </span>
          )}
        </span>

        <ChevronDown
          className={cn(
            "ml-3 h-5 w-5 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180",
          )}
        />
      </Button>

      {expanded && (
        <div id="professional-options" className="border-t border-border p-2">
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => selectProfessional("any")}
              className={cn(
                "relative h-auto min-h-24 flex-col gap-2 whitespace-normal rounded-md px-1.5 py-3 text-xs",
                value === "any" && "bg-primary/10 text-primary ring-1 ring-primary/30",
              )}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-5 w-5" />
              </span>
              <span className="line-clamp-2 leading-tight">Cualquiera</span>
              {value === "any" && <Check className="absolute right-1.5 top-1.5 h-4 w-4" />}
            </Button>

            {professionals.map((professional) => {
              const isSelected = value === professional.id;
              return (
                <Button
                  key={professional.id}
                  type="button"
                  variant="ghost"
                  onClick={() => selectProfessional(professional.id)}
                  className={cn(
                    "relative h-auto min-h-24 flex-col gap-2 whitespace-normal rounded-md px-1.5 py-3 text-xs",
                    isSelected && "bg-primary/10 text-primary ring-1 ring-primary/30",
                  )}
                  aria-pressed={isSelected}
                >
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm ring-1 ring-border">
                    <AvatarImage src={imageFor(professional)} alt={professional.name} className="object-cover" />
                    <AvatarFallback className="text-xs font-semibold">
                      {imageFor(professional) ? initialsFor(professional.name) : <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-2 leading-tight">{professional.name}</span>
                  {isSelected && <Check className="absolute right-1.5 top-1.5 h-4 w-4" />}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}