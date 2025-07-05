import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import Peer from 'peerjs';

export default function VideoChat() {
  const { appointmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [therapistConnected, setTherapistConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const streamRef = useRef();

  useEffect(() => {
    initializeSession();
    return () => cleanupSession();
  }, []);

  const initializeSession = async () => {
    try {
      // Initialize socket connection
      socketRef.current = io(process.env.REACT_APP_SOCKET_SERVER);

      // Initialize WebRTC peer
      peerRef.current = new Peer({
        host: process.env.REACT_APP_PEER_SERVER,
        port: process.env.REACT_APP_PEER_PORT,
        path: '/peerjs',
        secure: process.env.NODE_ENV === 'production'
      });

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Setup socket event handlers
      setupSocketHandlers();

      // Setup peer event handlers
      setupPeerHandlers();

      setLoading(false);
      setConnected(true);
    } catch (error) {
      console.error('Error initializing video chat:', error);
      toast.error('Failed to initialize video chat');
      setLoading(false);
    }
  };

  const setupSocketHandlers = () => {
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-appointment', {
        appointmentId,
        role: 'patient'
      });
    });

    socketRef.current.on('therapist-joined', () => {
      setTherapistConnected(true);
      toast.success('Therapist has joined the session');
    });

    socketRef.current.on('therapist-left', () => {
      setTherapistConnected(false);
      toast.info('Therapist has left the session');
    });

    socketRef.current.on('error', (error) => {
      toast.error(error.message);
    });
  };

  const setupPeerHandlers = () => {
    peerRef.current.on('open', (id) => {
      socketRef.current.emit('peer-id', {
        appointmentId,
        peerId: id
      });
    });

    peerRef.current.on('call', (call) => {
      call.answer(streamRef.current);
      call.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });
    });

    peerRef.current.on('error', (error) => {
     
      toast.error('Connection error occurred');
    });
  };

  const cleanupSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  if (loading) {
    return <div>Initializing video chat...</div>;
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Local Video */}
        <Card className="relative">
          <CardContent className="p-0">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <div className="absolute flex space-x-4 transform -translate-x-1/2 bottom-4 left-1/2">
              <Button
                variant={isMuted ? 'destructive' : 'secondary'}
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? '🔇' : '🔊'}
              </Button>
              <Button
                variant={isVideoOff ? 'destructive' : 'secondary'}
                size="icon"
                onClick={toggleVideo}
              >
                {isVideoOff ? '📵' : '📹'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Remote Video */}
        <Card className="relative">
          <CardContent className="p-0">
            {therapistConnected ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-[400px] object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">
                  Waiting for therapist to join...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Connection Status */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {connected
            ? `Connected ${therapistConnected ? '- Session in progress' : '- Waiting for therapist'}`
            : 'Disconnected'}
        </p>
      </div>
    </div>
  );
}