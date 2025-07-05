import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { useAuth } from '../../lib/AuthContext';
import { therapistApi } from '../../services/api';
import { Clock, Calendar, Save, AlertCircle, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const workingDaysOptions = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30'
];

const defaultStart = timeSlots[0];
const defaultEnd = timeSlots[timeSlots.length - 1];

export default function TherapistAvailability() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState({
    workingHours: {
      start: defaultStart,
      end: defaultEnd
    },
    appointmentDuration: 30,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [existingSlots, setExistingSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'physiotherapist') {
      loadCurrentAvailability();
      loadExistingSlots();
    }
  }, [isAuthenticated, user]);

  const loadCurrentAvailability = async () => {
    try {
      setLoading(true);
      const response = await therapistApi.getProfile(user._id);
      if (response.data?.data) {
        const profile = response.data.data;
        setAvailability({
          workingHours: {
            start: timeSlots.includes(profile.workingHours?.start) ? profile.workingHours.start : defaultStart,
            end: timeSlots.includes(profile.workingHours?.end) ? profile.workingHours.end : defaultEnd
          },
          appointmentDuration: profile.appointmentDuration || 30,
          workingDays: profile.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        });
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      toast.error('Failed to load current availability');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingSlots = async () => {
    try {
      setLoadingSlots(true);
      const response = await therapistApi.getAvailabilitySlots();
      setExistingSlots(response.data.data || []);
    } catch (error) {
      console.error('Error loading slots:', error);
      toast.error('Failed to load availability slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleWorkingDayToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Validate working hours
      if (availability.workingHours.start >= availability.workingHours.end) {
        toast.error('End time must be after start time');
        return;
      }
      // Validate working days
      if (availability.workingDays.length === 0) {
        toast.error('Please select at least one working day');
        return;
      }
      // Send as JSON, not FormData
      const data = {
        workingHours: availability.workingHours,
        appointmentDuration: availability.appointmentDuration,
        workingDays: availability.workingDays
      };
      await therapistApi.updateProfile(user._id, data);
      toast.success('Availability updated successfully');
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error(
        error.response?.data?.message ||
        'Failed to update availability'
      );
    } finally {
      setSaving(false);
    }
  };

  const generateTimeSlotsPreview = () => {
    const { start, end } = availability.workingHours;
    const duration = availability.appointmentDuration;
    
    const slots = [];
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    
    while (startTime < endTime) {
      const timeString = startTime.toTimeString().slice(0, 5);
      slots.push(timeString);
      startTime.setMinutes(startTime.getMinutes() + duration);
    }
    
    return slots;
  };

  const handleAddSlots = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    const slots = generateTimeSlotsPreview();
    if (slots.length === 0) {
      toast.error('No valid time slots generated');
      return;
    }
    try {
      await therapistApi.addAvailabilitySlots({
        date: selectedDate,
        timeSlots: slots,
        duration: availability.appointmentDuration
      });
      toast.success('Slots added!');
      setSelectedDate('');
      loadExistingSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add slots');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await therapistApi.deleteAvailabilitySlot(slotId);
      toast.success('Slot deleted successfully');
      loadExistingSlots();
    } catch (error) {
      toast.error('Failed to delete slot');
    }
  };

  if (!isAuthenticated || user?.role !== 'physiotherapist') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need to be logged in as a therapist to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading availability settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Availability</h1>
            <p className="text-gray-600">
              Set your working hours, appointment duration, and available days to help patients book appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Working Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Working Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Select
                      value={timeSlots.includes(availability.workingHours.start) ? availability.workingHours.start : defaultStart}
                      onValueChange={(value) =>
                        setAvailability(prev => ({
                          ...prev,
                          workingHours: { ...prev.workingHours, start: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Select
                      value={timeSlots.includes(availability.workingHours.end) ? availability.workingHours.end : defaultEnd}
                      onValueChange={(value) =>
                        setAvailability(prev => ({
                          ...prev,
                          workingHours: { ...prev.workingHours, end: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Appointment Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select
                    value={availability.appointmentDuration.toString()}
                    onValueChange={(value) =>
                      setAvailability(prev => ({
                        ...prev,
                        appointmentDuration: parseInt(value)
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Working Days */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Working Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {workingDaysOptions.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={availability.workingDays.includes(day)}
                        onCheckedChange={() => handleWorkingDayToggle(day)}
                      />
                      <Label htmlFor={day} className="text-sm font-medium">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Slots Preview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Available Time Slots Preview</CardTitle>
                <p className="text-sm text-gray-600">
                  Based on your current settings, here are the time slots that will be available to patients:
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {generateTimeSlotsPreview().map((slot, index) => (
                    <div
                      key={index}
                      className="p-2 text-center text-sm bg-primary/10 rounded border border-primary/20"
                    >
                      {slot}
                    </div>
                  ))}
                </div>
                {generateTimeSlotsPreview().length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No time slots available with current settings. Please adjust your working hours or days.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Availability
                </>
              )}
            </Button>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Add Availability Slots
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="date">Select Date</Label>
                  <Input
                    type="date"
                    id="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                  />
                </div>
                {selectedDate && (
                  <div>
                    <Label className="mb-2 block">Preview Time Slots</Label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {generateTimeSlotsPreview().map(time => (
                        <div key={time} className="text-sm p-2 bg-gray-100 rounded">
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Button onClick={handleAddSlots} disabled={!selectedDate} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slots
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Existing Slots */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Existing Availability Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSlots ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading slots...</p>
                </div>
              ) : existingSlots.length === 0 ? (
                <p className="text-center text-gray-600 py-4">No availability slots found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {existingSlots.map(slot => (
                    <div
                      key={slot._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {new Date(slot.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">{slot.time}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSlot(slot._id)}
                        disabled={slot.isBooked}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
} 