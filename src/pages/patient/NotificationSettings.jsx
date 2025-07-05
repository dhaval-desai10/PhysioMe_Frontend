import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    appointmentReminders: true,
    exerciseReminders: true,
    progressReports: true,
    treatmentPlanUpdates: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const response = await axios.get('/api/user/notification-settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      toast.error('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/user/notification-settings', settings);
      toast.success('Notification settings updated successfully');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
              <div className="text-sm text-gray-500">
                Receive email reminders about upcoming appointments
              </div>
            </div>
            <Switch
              id="appointmentReminders"
              checked={settings.appointmentReminders}
              onCheckedChange={() => handleToggle('appointmentReminders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="exerciseReminders">Exercise Reminders</Label>
              <div className="text-sm text-gray-500">
                Get daily reminders for your exercise routine
              </div>
            </div>
            <Switch
              id="exerciseReminders"
              checked={settings.exerciseReminders}
              onCheckedChange={() => handleToggle('exerciseReminders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="progressReports">Progress Reports</Label>
              <div className="text-sm text-gray-500">
                Receive weekly progress report summaries
              </div>
            </div>
            <Switch
              id="progressReports"
              checked={settings.progressReports}
              onCheckedChange={() => handleToggle('progressReports')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="treatmentPlanUpdates">Treatment Plan Updates</Label>
              <div className="text-sm text-gray-500">
                Get notified when your treatment plan is updated
              </div>
            </div>
            <Switch
              id="treatmentPlanUpdates"
              checked={settings.treatmentPlanUpdates}
              onCheckedChange={() => handleToggle('treatmentPlanUpdates')}
            />
          </div>

          <div className="pt-6">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}