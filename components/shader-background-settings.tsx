'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Palette, RotateCcw } from 'lucide-react';

interface ColorRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface ShaderSettings {
  bgColor1: ColorRGBA;
  bgColor2: ColorRGBA;
  lineColor: ColorRGBA;
}

const defaultSettings: ShaderSettings = {
  bgColor1: { r: 0.05, g: 0.05, b: 0.2, a: 1.0 },
  bgColor2: { r: 0.2, g: 0.05, b: 0.4, a: 1.0 },
  lineColor: { r: 0.5, g: 0.3, b: 0.9, a: 1.0 },
};

// Convert 0-1 to 0-255 for display
const toHex = (value: number) => Math.round(value * 255).toString(16).padStart(2, '0');
const rgbaToHex = (color: ColorRGBA) => `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;

// Convert hex to 0-1 range
const hexToRgba = (hex: string): ColorRGBA => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
        a: 1.0,
      }
    : { r: 0, g: 0, b: 0, a: 1 };
};

export default function ShaderBackgroundSettings() {
  const [settings, setSettings] = useState<ShaderSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTheme, setActiveTheme] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    fetchActiveTheme();
  }, []);

  const fetchActiveTheme = async () => {
    try {
      const response = await fetch('/api/themes');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.themes) {
          const active = data.themes.find((t: any) => t.isActive);
          if (active) {
            setActiveTheme(active.name);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch active theme:', error);
    }
  };

  const fetchSettings = async () => {
    setFetching(true);
    try {
      const response = await fetch('/api/settings/shader-background');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shader background settings',
        variant: 'destructive',
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/shader-background', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Shader background settings updated successfully',
        });
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save shader background settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (colorKey: keyof ShaderSettings, hexValue: string) => {
    const rgba = hexToRgba(hexValue);
    setSettings((prev) => ({
      ...prev,
      [colorKey]: rgba,
    }));
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast({
      title: 'Reset',
      description: 'Settings reset to default values',
    });
  };

  if (fetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Shader Background Settings
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Shader Background Settings
        </CardTitle>
        <CardDescription>
          Customize the animated shader background colors for your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Integration Info */}
        {activeTheme && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Theme Integration Active
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Currently using <strong>{activeTheme}</strong> theme. The shader background automatically adapts to match your active theme colors. 
                  Customize below to override theme defaults.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Background Color 1 */}
        <div className="space-y-2">
          <Label htmlFor="bgColor1">Background Color 1 (Top/Left)</Label>
          <div className="flex gap-4 items-center">
            <Input
              id="bgColor1"
              type="color"
              value={rgbaToHex(settings.bgColor1)}
              onChange={(e) => handleColorChange('bgColor1', e.target.value)}
              className="w-20 h-10 cursor-pointer"
            />
            <div className="text-sm text-muted-foreground">
              RGB: ({Math.round(settings.bgColor1.r * 255)}, {Math.round(settings.bgColor1.g * 255)},{' '}
              {Math.round(settings.bgColor1.b * 255)})
            </div>
          </div>
        </div>

        {/* Background Color 2 */}
        <div className="space-y-2">
          <Label htmlFor="bgColor2">Background Color 2 (Bottom/Right)</Label>
          <div className="flex gap-4 items-center">
            <Input
              id="bgColor2"
              type="color"
              value={rgbaToHex(settings.bgColor2)}
              onChange={(e) => handleColorChange('bgColor2', e.target.value)}
              className="w-20 h-10 cursor-pointer"
            />
            <div className="text-sm text-muted-foreground">
              RGB: ({Math.round(settings.bgColor2.r * 255)}, {Math.round(settings.bgColor2.g * 255)},{' '}
              {Math.round(settings.bgColor2.b * 255)})
            </div>
          </div>
        </div>

        {/* Line Color */}
        <div className="space-y-2">
          <Label htmlFor="lineColor">Line/Wave Color</Label>
          <div className="flex gap-4 items-center">
            <Input
              id="lineColor"
              type="color"
              value={rgbaToHex(settings.lineColor)}
              onChange={(e) => handleColorChange('lineColor', e.target.value)}
              className="w-20 h-10 cursor-pointer"
            />
            <div className="text-sm text-muted-foreground">
              RGB: ({Math.round(settings.lineColor.r * 255)}, {Math.round(settings.lineColor.g * 255)},{' '}
              {Math.round(settings.lineColor.b * 255)})
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="grid grid-cols-3 gap-4">
            <div
              className="h-16 rounded-lg border shadow-sm"
              style={{ backgroundColor: rgbaToHex(settings.bgColor1) }}
            />
            <div
              className="h-16 rounded-lg border shadow-sm"
              style={{ backgroundColor: rgbaToHex(settings.bgColor2) }}
            />
            <div
              className="h-16 rounded-lg border shadow-sm"
              style={{ backgroundColor: rgbaToHex(settings.lineColor) }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
          <Button onClick={handleReset} variant="outline" disabled={loading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
