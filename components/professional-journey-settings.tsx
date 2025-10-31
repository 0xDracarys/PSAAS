'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  achievements: string[];
}

const ProfessionalJourneySettings: React.FC = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfessionalJourney();
  }, []);

  const fetchProfessionalJourney = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/professional-journey');
      
      if (!response.ok) {
        throw new Error('Failed to fetch professional journey');
      }

      const data = await response.json();
      setExperience(data.experience || []);
    } catch (error) {
      console.error('Error fetching professional journey:', error);
      toast({
        title: 'Error',
        description: 'Failed to load professional journey data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch('/api/settings/professional-journey', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ experience }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save professional journey');
      }

      toast({
        title: 'Success!',
        description: 'Professional journey updated successfully',
      });
    } catch (error) {
      console.error('Error saving professional journey:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save changes',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      duration: '',
      description: '',
      achievements: [''],
    };
    setExperience([...experience, newExp]);
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperience(experience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addAchievement = (expId: string) => {
    setExperience(experience.map(exp =>
      exp.id === expId
        ? { ...exp, achievements: [...exp.achievements, ''] }
        : exp
    ));
  };

  const updateAchievement = (expId: string, achievementIndex: number, value: string) => {
    setExperience(experience.map(exp =>
      exp.id === expId
        ? {
            ...exp,
            achievements: exp.achievements.map((ach, idx) =>
              idx === achievementIndex ? value : ach
            ),
          }
        : exp
    ));
  };

  const removeAchievement = (expId: string, achievementIndex: number) => {
    setExperience(experience.map(exp =>
      exp.id === expId
        ? {
            ...exp,
            achievements: exp.achievements.filter((_, idx) => idx !== achievementIndex),
          }
        : exp
    ));
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const newExperience = [...experience];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newExperience.length) return;

    [newExperience[index], newExperience[targetIndex]] = [
      newExperience[targetIndex],
      newExperience[index],
    ];

    setExperience(newExperience);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Professional Journey</h2>
          <p className="text-gray-400 mt-1">
            Manage your work experience and career timeline
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={addExperience}
            variant="outline"
            className="bg-purple-500/10 border-purple-500 text-purple-400 hover:bg-purple-500/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {experience.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400 mb-4">No experience entries yet</p>
            <Button
              onClick={addExperience}
              variant="outline"
              className="bg-purple-500/10 border-purple-500 text-purple-400 hover:bg-purple-500/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <Card key={exp.id} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-gray-500 cursor-move" />
                    <CardTitle className="text-lg text-white">
                      Experience #{index + 1}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => moveExperience(index, 'up')}
                      disabled={index === 0}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      ↑
                    </Button>
                    <Button
                      onClick={() => moveExperience(index, 'down')}
                      disabled={index === experience.length - 1}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      ↓
                    </Button>
                    <Button
                      onClick={() => removeExperience(exp.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${exp.id}`} className="text-gray-300">
                      Job Title *
                    </Label>
                    <Input
                      id={`title-${exp.id}`}
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                      placeholder="e.g., Senior Developer"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`company-${exp.id}`} className="text-gray-300">
                      Company *
                    </Label>
                    <Input
                      id={`company-${exp.id}`}
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="e.g., TechCorp"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`duration-${exp.id}`} className="text-gray-300">
                    Duration *
                  </Label>
                  <Input
                    id={`duration-${exp.id}`}
                    value={exp.duration}
                    onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                    placeholder="e.g., 2020 - Present"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${exp.id}`} className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id={`description-${exp.id}`}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="Brief description of your role and responsibilities..."
                    className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">Key Achievements</Label>
                    <Button
                      onClick={() => addAchievement(exp.id)}
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Achievement
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {exp.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex gap-2">
                        <Input
                          value={achievement}
                          onChange={(e) =>
                            updateAchievement(exp.id, achIndex, e.target.value)
                          }
                          placeholder={`Achievement ${achIndex + 1}`}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Button
                          onClick={() => removeAchievement(exp.id, achIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalJourneySettings;
