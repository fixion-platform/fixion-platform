import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import referencePhoto1 from "../assets/rp1.png";
import referencePhoto2 from "../assets/rp2.png";
import referencePhoto3 from "../assets/rp3.png";
import referencePhoto4 from "../assets/rp4.png";

export default function NotificationModal({ open, onClose, notifications = [], onMarkAllRead }) {
  const [activeTab, setActiveTab] = useState("all");
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const filteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return localNotifications.filter(n => n.unread);
      case "inbox":
        return localNotifications;
      default:
        return localNotifications;
    }
  };

  const unreadCount = localNotifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    const updatedNotifications = localNotifications.map(notification => ({
      ...notification,
      unread: false
    }));
    setLocalNotifications(updatedNotifications);
    
    if (onMarkAllRead) {
      onMarkAllRead(updatedNotifications);
    }
  };

  const handleViewDetails = (notification, index) => {
    console.log("View Details clicked for:", notification.name, "at index:", index);
    
    if (index === 0 && notification.message.includes("job request")) {
      console.log("Navigating to job details page");
      
      onClose();
      
      setTimeout(() => {
        navigate(`/jobdetail`, { 
          state: { 
            jobData: {
              clientName: notification.name,
              clientPhone: notification.phone || "+234 804 567 8901",
              clientProfile: notification.profile,
              timeAgo: notification.time,
              date: notification.date,
              jobTitle: notification.jobTitle || "Studio Wiring Project",
              location: notification.location || "7 Looney Lane, Aberdeen.",
              description: notification.description || "I need you to wire a small recording/production studio space. The job involves setting up audio, electrical and data cables neatly and professionally — including connecting mixers, speakers, microphones, power outlets, patch panels and network points. You must ensure clean signal flow, proper labeling, cable management (trunking/ties), and a tidy finish. Experience with studio or audiovisual installations is required.",
              rating: notification.rating || 3,
              
              referencePhotos: [
                referencePhoto1,
                referencePhoto2,
                referencePhoto3,
                referencePhoto4
              ]
            }
          }
        });
      }, 100);
    } else if (notification.message.includes("message")) {
      console.log("This is a message notification - different action needed");
      onClose();
    } else {
      console.log("Other notification type - no specific action");
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      <div
        ref={modalRef}
        className="absolute right-0 top-[70px] w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-w-[calc(100vw-2rem)]"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-xl text-gray-900">Notification</h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className={`text-sm font-medium transition-colors ${
                unreadCount === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-[#050150] hover:text-[#030112]'
              }`}
            >
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              aria-label="Close notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-6 py-3 border-b border-gray-100">
          <button
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === "all"
                ? "text-[#050150] border-[#050150]"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === "unread"
                ? "text-[#050150] border-[#050150]"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("unread")}
          >
            Unread({unreadCount})
          </button>
          <button
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === "inbox"
                ? "text-[#050150] border-[#050150]"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("inbox")}
          >
            Inbox
          </button>
        </div>

        {/* Notifications */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredNotifications().length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10 17H5l5 5v-5zM14 7h.01M10 7h.01M6 7h.01M6 11h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
              </svg>
              <p className="text-sm">No notifications found</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredNotifications().map((notification, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer relative"
                >
                  <img
                    src={notification.profile}
                    alt={notification.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 leading-relaxed">
                          <span className="font-semibold">{notification.name}</span>{" "}
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time} • {notification.date}
                        </p>
                        {notification.actionText && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("Button clicked for:", notification.name);
                              handleViewDetails(notification, index);
                            }}
                            className="text-xs text-[#050150] hover:text-[#030112] transition-colors mt-2 font-medium cursor-pointer hover:underline bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                          >
                            {notification.actionText}
                          </button>
                        )}
                      </div>
                      {notification.unread && (
                        <span className="w-3 h-3 bg-[#050150] rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
