
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TransactionFiltersProps {
  categories: string[];
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  filterAmountMin: string;
  setFilterAmountMin: (amount: string) => void;
  filterAmountMax: string;
  setFilterAmountMax: (amount: string) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  categories,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  filterAmountMin,
  setFilterAmountMin,
  filterAmountMax,
  setFilterAmountMax,
}) => {
  const resetFilters = () => {
    setFilterStatus(null);
    setFilterCategory(null);
    setFilterAmountMin("");
    setFilterAmountMax("");
  };

  return (
    <Card className="shadow-sm animate-fade-in">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filterStatus || ""}
              onValueChange={(value) => setFilterStatus(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={filterCategory || ""}
              onValueChange={(value) => setFilterCategory(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount Range</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={filterAmountMin}
                onChange={(e) => setFilterAmountMin(e.target.value)}
                className="w-full"
              />
              <span>to</span>
              <Input
                type="number"
                placeholder="Max"
                value={filterAmountMax}
                onChange={(e) => setFilterAmountMax(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={resetFilters}
              disabled={
                !filterStatus && 
                !filterCategory && 
                !filterAmountMin && 
                !filterAmountMax
              }
            >
              <X className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionFilters;
