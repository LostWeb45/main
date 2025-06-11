"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label, Separator } from "@/components/ui";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { Container, Title } from "@/components/shared";
import toast from "react-hot-toast";

type Category = { id: number; name: string };
type Town = { id: number; name: string };

export default function CreateEventPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    duration: 60,
    price: 0,
    place: "",
    age: 0,
    categoryId: "",
    townId: "",
    participantsCount: 2,
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [towns, setTowns] = useState<Town[]>([]);
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories/all")
      .then((res) => res.json())
      .then(setCategories);
    fetch("/api/towns")
      .then((res) => res.json())
      .then((data) => {
        const spb = data.filter((town: Town) =>
          town.name.toLowerCase().includes("петербург")
        );
        setTowns(spb);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls: string[] = [];

      if (images) {
        const uploads = Array.from(images).map(async (image) => {
          const imgForm = new FormData();
          imgForm.append("eventImage", image);

          const res = await fetch("http://82.202.128.170:3000/upload/event", {
            method: "POST",
            body: imgForm,
          });

          if (!res.ok) throw new Error("Ошибка загрузки картинки");

          const data = await res.json();
          imageUrls.push(data.url);
        });

        await Promise.all(uploads);
      }

      const eventData = { ...form, description, imageUrls };

      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (res.ok) {
        toast.success("Событие отправлено на модерацию", {
          duration: 3000,
        });
        router.push("/events");
      } else {
        alert("Ошибка при создании события");
      }
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка при создании события");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        <Title className="font-semibold " text="Создать событие" />
        <Separator />
        <div className="flex justify-between gap-[30px]">
          <div className=" w-[60%] flex flex-col gap-[18px]">
            <div className="space-y-2">
              <Label className="text-[17px]" htmlFor="title">
                Название
              </Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-3">
              <div>
                <Label className="text-[17px]" htmlFor="images">
                  Изображения
                </Label>
                <Input
                  className="text-[#325288] pt-[5px] text-[16px] font-semibold w-[355px] cursor-pointer"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <Label className="text-[17px]">Категория</Label>

                <Select
                  onValueChange={(value) =>
                    handleSelectChange("categoryId", value)
                  }
                >
                  <SelectTrigger size="lg" className="text-[white]!">
                    <SelectValue placeholder="Выбрать категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[17px]">Город</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("townId", value)}
                >
                  <SelectTrigger size="lg" className="text-[white]!">
                    <SelectValue placeholder="Выбрать город" />
                  </SelectTrigger>
                  <SelectContent>
                    {towns.map((town) => (
                      <SelectItem key={town.id} value={String(town.id)}>
                        {town.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[17px]" htmlFor="description">
                Описание
              </Label>
              <RichTextEditor value={description} onChange={setDescription} />
            </div>
          </div>
          <div className="w-[40%] flex flex-col gap-[18px]">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[17px]" htmlFor="startDate">
                  Дата начала
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-[40px]",
                        !form.startDate && "text-black"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.startDate
                        ? format(new Date(form.startDate), "PPP", {
                            locale: ru,
                          })
                        : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        form.startDate ? new Date(form.startDate) : undefined
                      }
                      onSelect={(date) =>
                        setForm((prev) => ({
                          ...prev,
                          startDate: date ? format(date, "yyyy-MM-dd") : "",
                        }))
                      }
                      locale={ru}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-[17px]" htmlFor="startTime">
                  Время начала
                </Label>
                <Input
                  className=" h-[40px] border-none bg-[#f2f4fb] cursor-pointer hover:bg-accent hover:text-[#555e7e] dark:hover:bg-accent/50"
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[17px]" htmlFor="duration">
                  Продолжительность (мин)
                </Label>
                <Input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[17px]" htmlFor="price">
                  Цена
                </Label>
                <Input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[17px]" htmlFor="place">
                Место проведения
              </Label>
              <Input
                name="place"
                value={form.place}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[17px]" htmlFor="age">
                  Возрастное ограничение
                </Label>
                <Input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[17px]" htmlFor="participantsCount">
                  Кол-во участников
                </Label>
                <Input
                  type="number"
                  name="participantsCount"
                  value={form.participantsCount}
                  min={2}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-[45px] text-[18px] "
            >
              {loading ? "Создание..." : "Создать"}
            </Button>
          </div>
        </div>
      </form>
    </Container>
  );
}
