import { supabase } from "./supabase";

export async function getLastReport(userId) {
  const { data, error } = await supabase
    .from("scan_reports")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getReportById(reportId) {
  const { data, error } = await supabase
    .from("scan_reports")
    .select("*")
    .eq("id", reportId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getLastTwoReports(userId) {
  const { data, error } = await supabase
    .from("scan_reports")
    .select("health_score, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(2);
  if (error) throw error;
  return data || [];
}
