'use client';

import { useState, useEffect } from 'react';
import {
  GetAllIssueType,
  GetSubIssueType,
  CreateNewHelpTicket,
  HelpdeskAttachment,
} from '@/services/apiCalls/helpdeskservices';
import { showErrorToastMessage } from '@/utils/toast.utils';
import { useAuth } from '@/features/auth/context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
  booking: any;
}

const ISSUE_TYPES = [
  { id: '1', label: 'Refund', name: 'REFUND' },
  { id: '2', label: 'Payment', name: 'PAYMENT' },
  { id: '3', label: 'Boarding Pass', name: 'BOARDING_PASS' },
  { id: '4', label: 'Payment Mode', name: 'PAYMENT_MODE' },
  { id: '5', label: 'Ticket', name: 'TICKET' },
  { id: '6', label: 'Portal', name: 'PORTAL' },
  { id: '7', label: 'Choice Guide', name: 'CHOICE_GUIDE' },
  { id: '8', label: 'Choice Vehicle', name: 'CHOICE_VEHICLE' },
  { id: '9', label: 'Tourist Place', name: 'TOURIST_PLACE' },
  { id: '10', label: 'Cancellation', name: 'CANCELLATION' },
  { id: '11', label: 'General Query', name: 'GENERAL_QUERY' },
  { id: '12', label: 'Difference Amount', name: 'DIFFERENCE_AMOUNT' },
  { id: '13', label: 'Information Not Visible', name: 'INFO_NOT_VISIBLE' },
];

const OPTIONAL_BOOKING_TYPES = [
  'PAYMENT_MODE', 'INFO_NOT_VISIBLE', 'PORTAL', 'GENERAL_QUERY', 'TOURIST_PLACE',
];

export default function RaiseIssueModal({ open, onClose, booking }: Props) {
  const { user } = useAuth();
  const u = user as any;
  const [userName, setUserName] = useState(u?.name || u?.displayName || '');
  const [mobileNumber, setMobileNumber] = useState(u?.mobile || u?.mobileNo || '');
  const [emailId, setEmailId] = useState(u?.email || '');
  const [ticketType, setTicketType] = useState('');
  const [subTicketType, setSubTicketType] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  const placeId = booking?.placeDetailDto?.id || booking?.placeId || '';
  const bookingId = booking?.bookingId || booking?.id || '';

  // Sync user info if user changes
  useEffect(() => {
    if (u?.name || u?.displayName) setUserName(u.name || u.displayName);
    if (u?.mobile || u?.mobileNo) setMobileNumber(u.mobile || u.mobileNo);
    if (u?.email) setEmailId(u.email);
  }, [user]);

  // Get sub-issue types for selected ticket type
  const selectedIssue = ISSUE_TYPES.find((i) => i.name === ticketType);
  const { data: subIssueData } = GetSubIssueType(selectedIssue?.id, !!ticketType);
  const subIssueOptions = subIssueData?.result ?? [];

  const helpdeskAttachment = HelpdeskAttachment();
  const createTicket = CreateNewHelpTicket(
    () => {
      onClose();
      reset();
    },
    () => {},
  );

  function reset() {
    setTicketType('');
    setSubTicketType('');
    setDescription('');
    setAttachmentUrl('');
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation matching old project
    const allowedExt = ['jpg', 'jpeg', 'png', 'pdf'];
    const allowedMime = ['image/jpeg', 'image/png', 'application/pdf'];
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const dotCount = (file.name.match(/\./g) || []).length;

    if (dotCount > 1) {
      showErrorToastMessage('Invalid file name. Multiple dots not allowed.');
      e.target.value = '';
      return;
    }
    if (!allowedExt.includes(ext) || !allowedMime.includes(file.type)) {
      showErrorToastMessage('Only JPG, PNG, or PDF files are allowed.');
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showErrorToastMessage('File size must be under 2MB');
      e.target.value = '';
      return;
    }

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('imageOrPdf', file); // matches old project field name
      const res: any = await helpdeskAttachment.mutateAsync(formData);
      // Response shape: { result: [url_string, ...] }
      const url = res?.result?.[0] || res?.result?.url || res?.result;
      if (url) setAttachmentUrl(typeof url === 'string' ? url : '');
      else showErrorToastMessage('Upload succeeded but URL missing');
    } catch {
      showErrorToastMessage('File upload failed');
    }
    setUploadingFile(false);
    e.target.value = '';
  }

  function handleSubmit() {
    if (!userName.trim()) { showErrorToastMessage('Please enter your name'); return; }
    if (!mobileNumber.trim() || !/^\d{10}$/.test(mobileNumber.trim())) {
      showErrorToastMessage('Please enter a valid 10-digit mobile number'); return;
    }
    if (!ticketType) { showErrorToastMessage('Please select issue type'); return; }
    if (!description.trim()) { showErrorToastMessage('Please describe the issue'); return; }

    const isBookingOptional = OPTIONAL_BOOKING_TYPES.includes(ticketType);
    if (!isBookingOptional && !bookingId) {
      showErrorToastMessage('Booking ID is required for this issue type');
      return;
    }

    const selectedSub = subIssueOptions.find((s: any) => (s.name || s.id) === subTicketType);

    // placeType in old project = the place name (string from dropdown)
    const placeName = booking?.placeName || booking?.placeDetailDto?.name || '';
    // placeId in old project = the OBMS MongoDB ObjectId
    const obmsPlaceId = booking?.placeDetailDto?.placeId || booking?.placeDetailDto?._id || placeId;

    // Payload structure matches old project exactly
    const payload: any = {
      ticketTitle: '',
      userName: userName.trim(),
      mobileNumber: mobileNumber.trim(),
      emailId: emailId.trim().replace(/\s/g, ''),
      ticketType,
      placeType: placeName, // place name, not placeType
      subTicketType: subTicketType || '',
      issueTypeId: selectedIssue?.id || '',
      issueSubTypeId: selectedSub?.id || selectedSub?._id || '',
      bookingId: isBookingOptional ? '' : String(bookingId),
      cancellationReason: '',
      description: description.trim(),
      attachmentFile: attachmentUrl || '',
      placeId: obmsPlaceId || '',
    };

    createTicket.mutate(payload);
  }

  if (!open) return null;

  return (
    <div className="modal-overlay open" style={{ zIndex: 9995 }} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal" role="dialog" aria-modal="true" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div className="modal-title">Raise an Issue</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {bookingId && (
            <div style={{ background: '#FFF5EE', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 11 }}>
              📋 Booking ID: <strong>#{bookingId}</strong>
              {booking?.placeName && <span> · {booking.placeName}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Your Name <span className="req">*</span></label>
            <input type="text" className="form-input" value={userName}
              maxLength={50}
              placeholder="Enter your name"
              onChange={(e) => setUserName(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number <span className="req">*</span></label>
            <input type="tel" className="form-input" value={mobileNumber}
              maxLength={10}
              placeholder="10-digit mobile number"
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))} />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={emailId}
              placeholder="your@email.com (optional)"
              onChange={(e) => setEmailId(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Issue Type <span className="req">*</span></label>
            <div className="select-wrap">
              <select className="form-select" value={ticketType}
                onChange={(e) => { setTicketType(e.target.value); setSubTicketType(''); }}>
                <option value="" disabled>Select issue type</option>
                {ISSUE_TYPES.map((t) => (
                  <option key={t.id} value={t.name}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {subIssueOptions.length > 0 && (
            <div className="form-group">
              <label className="form-label">Sub-Category</label>
              <div className="select-wrap">
                <select className="form-select" value={subTicketType}
                  onChange={(e) => setSubTicketType(e.target.value)}>
                  <option value="">Select sub-category (optional)</option>
                  {subIssueOptions.map((s: any) => (
                    <option key={s.id || s._id} value={s.name || s.id}>{s.label || s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Description <span className="req">*</span></label>
            <textarea className="form-input" rows={4} value={description}
              maxLength={500}
              placeholder="Describe your issue in detail"
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical' }} />
          </div>

          <div className="form-group">
            <label className="form-label">Attach Screenshot (optional)</label>
            {attachmentUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                <span style={{ flex: 1, color: '#2C2017' }}>📎 File attached</span>
                <button type="button" onClick={() => setAttachmentUrl('')}
                  style={{ background: 'transparent', border: 'none', color: '#E84545', cursor: 'pointer' }}>
                  ✕ Remove
                </button>
              </div>
            ) : (
              <input type="file" accept=".jpg,.jpeg,.png,.pdf"
                disabled={uploadingFile}
                onChange={handleFileChange}
                className="form-input"
                style={{ padding: 8 }} />
            )}
            {uploadingFile && <p style={{ fontSize: 10, color: '#7A6A58', marginTop: 4 }}>Uploading...</p>}
            <p style={{ fontSize: 10, color: '#7A6A58', marginTop: 4 }}>JPG, PNG, PDF — max 2MB</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-modal-close" onClick={onClose}>CANCEL</button>
          <button className="btn-modal-confirm" onClick={handleSubmit} disabled={createTicket.isPending}>
            {createTicket.isPending ? 'SUBMITTING...' : 'SUBMIT'}
          </button>
        </div>
      </div>
    </div>
  );
}
