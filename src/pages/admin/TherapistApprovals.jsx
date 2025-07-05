import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, Check, X } from 'lucide-react';
import { adminApi } from '../../services/api';
import { toast } from 'react-hot-toast';

const TherapistApprovals = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingTherapists, setPendingTherapists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/admin/login');
        return false;
      }
      
      if (user.role !== 'admin') {
        console.log('User is not an admin, redirecting to login');
        navigate('/admin/login');
        return false;
      }
      
      return true;
    };

    const fetchPendingTherapists = async () => {
      try {
        if (!checkAuth()) return;
        
        setLoading(true);
        setError(null);
        
        console.log('Fetching pending therapists...');
        const response = await adminApi.getPendingTherapists();
        const therapists = response.data?.data || [];

        setPendingTherapists(therapists);
      } catch (err) {
        console.error('Error fetching pending therapists:', err);
        if (err.response?.status === 401) {
          navigate('/admin/login');
        } else {
          setError(err.code === 'ERR_NETWORK' 
            ? 'Unable to connect to the server. Please check if the backend is running.'
            : 'Failed to load pending therapists. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTherapists();
  }, [navigate]);

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      await adminApi.approveTherapist(id);
      toast.success('Therapist approved successfully');
      
      // Update the list by removing the approved therapist
      setPendingTherapists(pendingTherapists.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error approving therapist:', error);
      toast.error('Failed to approve therapist');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoading(true);
      await adminApi.rejectTherapist(id);
      toast.success('Therapist rejected successfully');
      
      // Update the list by removing the rejected therapist
      setPendingTherapists(pendingTherapists.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error rejecting therapist:', error);
      toast.error('Failed to reject therapist');
    } finally {
      setLoading(false);
    }
  };

  const filteredTherapists = pendingTherapists.filter(therapist => 
    therapist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    therapist.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    therapist.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && pendingTherapists.length === 0) {
    return (
      <div className="min-h-screen p-6 bg-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-lg">Loading therapist approvals...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="p-4 mb-6 border-l-4 border-red-400 bg-red-50">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Therapist Approvals</h1>
        <Button onClick={() => navigate('/admin/dashboard')} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4 space-x-4">
          <div className="relative flex-1">
            <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Therapist Approvals</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {filteredTherapists.length > 0 ? (
              <div className="space-y-4">
                {filteredTherapists.map((therapist) => (
                  <div
                    key={therapist._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-semibold">{therapist.name}</h3>
                      <p className="text-sm text-muted-foreground">{therapist.email}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Specialization:</span> {therapist.specialization || 'Not specified'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">License:</span> {therapist.licenseNumber || 'Not provided'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Experience:</span> {therapist.experience || 0} years
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleApprove(therapist._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleReject(therapist._id)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/therapists/${therapist._id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No pending therapist approvals found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistApprovals;