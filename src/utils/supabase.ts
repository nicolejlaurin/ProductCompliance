import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const submitFormData = async (formData: any) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([
        {
          ...formData,
          submitted_at: new Date().toISOString(),
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false, error };
  }
};