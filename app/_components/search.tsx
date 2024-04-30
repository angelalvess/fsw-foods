import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const Search = () => {
  return (
    <div className="flex gap-2">
      <Input placeholder="Search restaurants" className="border-none " />
      <Button size="icon">
        <SearchIcon size={20} />
      </Button>
    </div>
  );
};
