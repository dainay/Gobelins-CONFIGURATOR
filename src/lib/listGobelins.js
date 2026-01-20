import { supabase } from "./supabase";

const PAGE_SIZE = 3;

export async function fetchGobelinsPage(page = 0, pageSize = PAGE_SIZE) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from("gobelins")
    .select(
      "user_id, name, guild, hair, cloth, animation, pose, created_at, user_name",
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data ?? [];
}
