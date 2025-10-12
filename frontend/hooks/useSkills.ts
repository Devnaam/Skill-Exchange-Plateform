import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Skill, UserSkill, AddSkillData } from '@/types/skill';

export const useSkills = () => {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<{
    offered: UserSkill[];
    wanted: UserSkill[];
  }>({ offered: [], wanted: [] });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSkills = async (category?: string, search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await api.get(`/skills/all?${params.toString()}`);
      setAllSkills(response.data.skills);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSkills = async () => {
    try {
      setLoading(true);
      const response = await api.get('/skills/user');
      setUserSkills({
        offered: response.data.skillsOffered,
        wanted: response.data.skillsWanted,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch user skills');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/skills/categories');
      setCategories(response.data.categories);
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const addSkill = async (data: AddSkillData) => {
    try {
      const response = await api.post('/skills/user', data);
      await fetchUserSkills();
      return { success: true, userSkill: response.data.userSkill };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to add skill' };
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await api.delete(`/skills/user/${id}`);
      await fetchUserSkills();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete skill' };
    }
  };

  useEffect(() => {
    fetchAllSkills();
    fetchUserSkills();
    fetchCategories();
  }, []);

  return {
    allSkills,
    userSkills,
    categories,
    loading,
    error,
    fetchAllSkills,
    fetchUserSkills,
    addSkill,
    deleteSkill,
  };
};
