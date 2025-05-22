
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Filter, ArrowDownAZ, ArrowUpAZ, Star, User } from "lucide-react";

interface CustomerFiltersProps {
  filterTrusted: boolean | null;
  setFilterTrusted: (value: boolean | null) => void;
  sortBy: "name" | "spent" | "orders";
  setSortBy: (value: "name" | "spent" | "orders") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  filterTrusted,
  setFilterTrusted,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-muted hover:text-primary transition-colors duration-200"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Customers</DialogTitle>
          <DialogDescription>
            Set criteria to filter your customer list
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Trusted Status</Label>
            <div className="flex gap-2">
              <Button
                variant={filterTrusted === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTrusted(null)}
              >
                All
              </Button>
              <Button
                variant={filterTrusted === true ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTrusted(true)}
              >
                <Star className="mr-1 h-3 w-3" /> Trusted
              </Button>
              <Button
                variant={filterTrusted === false ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTrusted(false)}
              >
                <User className="mr-1 h-3 w-3" /> Regular
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sort By</Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("name")}
              >
                Name
              </Button>
              <Button
                variant={sortBy === "spent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("spent")}
              >
                Total Spent
              </Button>
              <Button
                variant={sortBy === "orders" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("orders")}
              >
                Order Count
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="ml-auto"
              >
                {sortOrder === "asc" ? (
                  <ArrowDownAZ className="h-4 w-4" />
                ) : (
                  <ArrowUpAZ className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setFilterTrusted(null);
              setSortBy("name");
              setSortOrder("asc");
            }}
          >
            Reset Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerFilters;
