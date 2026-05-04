'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  CreateMessage,
  CreateNewHelpTicket,
  GetAllBookings,
  GetAllHelpDeskListing,
  GetAllIssueType,
  GetDownloadTicketById,
  GetFilterBookingId,
  GetFilterPlace,
  GetHelpDeskChatById,
  GetHelpDeskChatSeen,
  GetHelpDeskDetailById,
  GetSubIssueType,
  GetUserIssueResult,
  HelpdeskAttachment,
} from '@/services/apiCalls/helpdeskservices';
import { queryClient } from '@/components/common/ReactQueryProvider';
import { queryKeys } from '@/utils/constants/react-query-keys.constants';
import { showErrorToastMessage } from '@/utils/toast.utils';
import { buildInventoryShareFile, buildJkkShareFile, buildSandstoneShareFile } from '@/utils/shareTicketPdf.utils';

type GrievanceStatus = 'ongoing' | 'resolved' | 'cancelled';

type GrievanceMessage = {
  id: string;
  from: 'support' | 'user';
  name: string;
  text: string;
  time: string;
  date: string;
};

type GrievanceUser = {
  name: string;
  email: string;
  mobile: string;
};

type Grievance = {
  id: string;
  issueType: string;
  ticketNo: string;
  bookingNo: string;
  raisedAt: string;
  status: GrievanceStatus;
  badgeClass: string;
  badgeLabel: string;
  subject: string;
  description: string;
  user: GrievanceUser;
  attachment: string | null;
  chatStatus: string;
  notificationCount: number;
};

type GrievanceGroups = Record<GrievanceStatus, Grievance[]>;

type DetailSectionKey = 'user' | 'description' | 'attachment';

type QueryFormState = {
  userName: string;
  mobileNumber: string;
  emailId: string;
  placeId: string;
  placeType: string;
  ticketType: string;
  subTicketType: string;
  issueTypeId: string;
  issueSubTypeId: string;
  bookingId: string;
  description: string;
  attachmentUrl: string;
  attachmentName: string;
};

type QueryFormErrors = Partial<Record<keyof QueryFormState, string>>;

const OPTIONAL_BOOKING_TYPES = [
  'PAYMENT_MODE',
  'INFO_NOT_VISIBLE',
  'PORTAL',
  'GENERAL_QUERY',
  'TOURIST_PLACE',
];

const DEFAULT_FORM_STATE: QueryFormState = {
  userName: '',
  mobileNumber: '',
  emailId: '',
  placeId: '',
  placeType: '',
  ticketType: '',
  subTicketType: '',
  issueTypeId: '',
  issueSubTypeId: '',
  bookingId: '',
  description: '',
  attachmentUrl: '',
  attachmentName: '',
};

const STATUS_META: Record<
  GrievanceStatus,
  {
    apiStatus: string;
    badgeClass: string;
    badgeLabel: string;
    chatStatus: string;
  }
> = {
  ongoing: {
    apiStatus: 'IN_PROGRESS',
    badgeClass: 'badge-ongoing',
    badgeLabel: 'Ongoing',
    chatStatus: 'In Progress',
  },
  resolved: {
    apiStatus: 'RESOLVED',
    badgeClass: 'badge-resolved',
    badgeLabel: 'Resolved',
    chatStatus: 'Resolved',
  },
  cancelled: {
    apiStatus: 'CANCELLED',
    badgeClass: 'badge-cancelled',
    badgeLabel: 'Cancelled',
    chatStatus: 'Cancelled',
  },
};

function asArray<T = any>(value: any): T[] {
  return Array.isArray(value) ? value : [];
}

function normalizeStatus(status: any): GrievanceStatus {
  const value = String(status || '').toUpperCase();
  if (value === 'RESOLVED') return 'resolved';
  if (value === 'CANCELLED') return 'cancelled';
  return 'ongoing';
}

function toDate(value: any) {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const numeric = Number(value);
  if (!Number.isNaN(numeric) && numeric > 0) {
    const normalizedNumeric = numeric < 1000000000000 ? numeric * 1000 : numeric;
    const numericDate = new Date(normalizedNumeric);
    if (!Number.isNaN(numericDate.getTime())) return numericDate;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateTime(value: any) {
  const date = toDate(value);
  if (!date) return 'N/A';

  const datePart = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);

  return `${datePart} ${timePart}`;
}

function formatClock(value: any) {
  const date = toDate(value);
  if (!date) return 'N/A';

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function formatDayLabel(value: any) {
  const date = toDate(value);
  if (!date) return 'N/A';

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const current = date.toDateString();
  if (current === today.toDateString()) return 'Today';
  if (current === yesterday.toDateString()) return 'Yesterday';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function getAttachmentName(fileUrl: string | null | undefined) {
  if (!fileUrl) return '';
  const lastSegment = fileUrl.split('/').pop() || fileUrl;
  return lastSegment.includes('_') ? lastSegment.slice(lastSegment.lastIndexOf('_') + 1) : lastSegment;
}

function normalizeTicket(dto: any): Grievance {
  const status = normalizeStatus(dto?.status);
  const meta = STATUS_META[status];
  const subject =
    String(dto?.ticketTitle || '').trim() ||
    String(dto?.ticketType || '').trim() ||
    String(dto?.subTicketType || '').trim() ||
    'Support Query';

  return {
    id: String(dto?.id ?? dto?.helpDeskUserId ?? dto?.helpTicketId ?? subject),
    issueType: String(dto?.ticketType || dto?.issueType || dto?.subTicketType || 'N/A'),
    ticketNo: String(dto?.helpTicketId || dto?.ticketNo || dto?.ticketNumber || 'N/A'),
    bookingNo: String(dto?.bookingId || dto?.bookingNo || 'N/A'),
    raisedAt: formatDateTime(dto?.createdDate || dto?.raisedAt),
    status,
    badgeClass: meta.badgeClass,
    badgeLabel: meta.badgeLabel,
    subject,
    description: String(dto?.description || 'No description available.'),
    user: {
      name: String(dto?.userName || dto?.name || 'User'),
      email: String(dto?.emailId || dto?.email || 'N/A'),
      mobile: String(dto?.mobileNumber || dto?.mobile || 'N/A'),
    },
    attachment: dto?.attachmentFile || dto?.attachment || null,
    chatStatus: meta.chatStatus,
    notificationCount: Number(dto?.notificationCount || 0),
  };
}

function buildInitialForm(user: any): QueryFormState {
  return {
    ...DEFAULT_FORM_STATE,
    userName: String(user?.name || user?.displayName || user?.fullName || ''),
    mobileNumber: String(user?.mobile || user?.mobileNo || ''),
    emailId: String(user?.email || ''),
  };
}

function LoginEmptyState({
  openLoginModal,
}: {
  openLoginModal: () => void;
}) {
  return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-title">Login to view grievances</div>
        <div className="empty-sub">Please login to track your support queries and complaints.</div>
        <button className="btn-p" onClick={openLoginModal}>
          Login
        </button>
      </div>
    </div>
  );
}

function MyGrievanceContent({ user }: { user: any }) {
  const [currentTab, setCurrentTab] = useState<GrievanceStatus>('ongoing');
  const [newQueryOpen, setNewQueryOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chatText, setChatText] = useState('');
  const [localTickets, setLocalTickets] = useState<Grievance[]>([]);
  const [localMessages, setLocalMessages] = useState<Record<string, GrievanceMessage[]>>({});
  const [form, setForm] = useState<QueryFormState>(() => buildInitialForm(user));
  const [formErrors, setFormErrors] = useState<QueryFormErrors>({});
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [ticketDownloadBookingId, setTicketDownloadBookingId] = useState('');
  const [ticketDownloadRequested, setTicketDownloadRequested] = useState(false);
  const [ticketDownloading, setTicketDownloading] = useState(false);
  const [sectionsCollapsed, setSectionsCollapsed] = useState<Record<DetailSectionKey, boolean>>({
    user: false,
    description: false,
    attachment: false,
  });

  const overlayOpen = newQueryOpen || !!selectedId;

  const ongoingQuery = GetAllHelpDeskListing('', [STATUS_META.ongoing.apiStatus], !!user);
  const resolvedQuery = GetAllHelpDeskListing('', [STATUS_META.resolved.apiStatus], !!user);
  const cancelledQuery = GetAllHelpDeskListing('', [STATUS_META.cancelled.apiStatus], !!user);

  const placeQuery = GetFilterPlace({
    districtId: '',
    searchKey: '',
    departmentId: '',
  });

  const allBookingsQuery = GetAllBookings({
    userId: String(user?.sub || user?.id || ''),
  });

  const issueTypeQuery = GetAllIssueType(form.placeId, Boolean(form.placeId));
  const subIssueTypeQuery = GetSubIssueType(form.issueTypeId, Boolean(form.issueTypeId));
  const bookingFilterQuery = GetFilterBookingId({
    placeId: form.placeId,
    issueType: form.issueTypeId,
    size: '',
    offset: '',
    pagination: '',
  });
  const shouldCheckTicketStatus = form.ticketType === 'TICKET' && !!form.issueTypeId && !!form.bookingId && !!form.issueSubTypeId;
  const userIssueQuery = GetUserIssueResult({
    bookingId: form.bookingId,
    issueType: form.issueTypeId,
    enabled: shouldCheckTicketStatus,
  });
  const downloadTicketQuery = GetDownloadTicketById(ticketDownloadBookingId, ticketDownloadRequested);

  const detailQuery = GetHelpDeskDetailById(selectedId || '');
  const chatQuery = GetHelpDeskChatById(selectedId || '');
  GetHelpDeskChatSeen(selectedId || '');

  const attachmentMutation = HelpdeskAttachment();
  const messageMutation = CreateMessage();
  const createTicketMutation = CreateNewHelpTicket(
    () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getAllHelpDeskListing] });
    },
    () => {},
  );

  const groupedGrievances = useMemo<GrievanceGroups>(() => {
    const mergeTickets = (apiTickets: Grievance[], extraTickets: Grievance[]) => {
      const map = new Map<string, Grievance>();
      [...extraTickets, ...apiTickets].forEach((ticket) => {
        map.set(ticket.id, ticket);
      });
      return Array.from(map.values());
    };

    return {
      ongoing: mergeTickets(
        asArray(ongoingQuery.data?.result?.helpDeskDtos).map(normalizeTicket),
        localTickets.filter((ticket) => ticket.status === 'ongoing'),
      ),
      resolved: asArray(resolvedQuery.data?.result?.helpDeskDtos).map(normalizeTicket),
      cancelled: asArray(cancelledQuery.data?.result?.helpDeskDtos).map(normalizeTicket),
    };
  }, [cancelledQuery.data, localTickets, ongoingQuery.data, resolvedQuery.data]);

  const stats = useMemo(() => {
    const totalOngoing = groupedGrievances.ongoing.length;
    const totalResolved = groupedGrievances.resolved.length;
    const totalCancelled = groupedGrievances.cancelled.length;
    return {
      total: totalOngoing + totalResolved + totalCancelled,
      totalOngoing,
      totalResolved,
      totalCancelled,
    };
  }, [groupedGrievances]);

  const currentList = groupedGrievances[currentTab];
  const fallbackSelected =
    groupedGrievances.ongoing.find((item) => item.id === selectedId) ||
    groupedGrievances.resolved.find((item) => item.id === selectedId) ||
    groupedGrievances.cancelled.find((item) => item.id === selectedId) ||
    null;

  const selectedGrievance = useMemo(() => {
    if (detailQuery.data?.result) return normalizeTicket(detailQuery.data.result);
    return fallbackSelected;
  }, [detailQuery.data, fallbackSelected]);

  const chatMessages = useMemo<GrievanceMessage[]>(() => {
    const apiMessages: GrievanceMessage[] = asArray(chatQuery.data?.result).map(
      (message: any, index: number): GrievanceMessage => {
      const isUserMessage =
        String(message?.createdByUserId ?? '') === String(user?.sub ?? user?.id ?? '');

      return {
        id: String(message?.id ?? `${selectedId}-message-${index}`),
        from: isUserMessage ? 'user' : 'support',
        name: String(message?.createdBy || (isUserMessage ? selectedGrievance?.user.name || 'You' : 'Support')),
        text: String(message?.messages || message?.message || ''),
        time: formatClock(message?.createdDate),
        date: formatDayLabel(message?.createdDate),
      };
    });

    const merged = new Map<string, GrievanceMessage>();
    [...apiMessages, ...(selectedId ? localMessages[selectedId] || [] : [])].forEach((message) => {
      merged.set(message.id, message);
    });
    return Array.from(merged.values());
  }, [chatQuery.data, localMessages, selectedGrievance?.user.name, selectedId, user?.id, user?.sub]);

  const places = asArray(placeQuery.data?.result?.placeDetailDtos);
  const issueTypes = asArray(issueTypeQuery.data?.result?.issueTypeDtos).filter(
    (item: any) => item?.active !== false,
  );

  const subIssueGroups = asArray(subIssueTypeQuery.data?.result?.issueTypeDtos);
  const subIssueTypes = subIssueGroups.flatMap((item: any) =>
    asArray(item?.issueSubTypeDtoList).filter((subItem: any) => subItem?.active !== false),
  );

  const filteredBookingOptions = asArray(bookingFilterQuery.data?.result?.helpDeskIssueResponseDtos);
  const recentBookingOptions =
    asArray(allBookingsQuery.data?.result?.helpDeskIssueResponseDtos).length > 0
      ? asArray(allBookingsQuery.data?.result?.helpDeskIssueResponseDtos)
      : asArray(allBookingsQuery.data?.result?.ticketBookingDetailDtos);

  const bookingOptions =
    filteredBookingOptions.length > 0 ? filteredBookingOptions : recentBookingOptions;

  const bookingIsOptional = OPTIONAL_BOOKING_TYPES.includes(form.ticketType);

  useEffect(() => {
    if (!overlayOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [overlayOpen]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      userName: String(user?.name || user?.displayName || user?.fullName || prev.userName),
      mobileNumber: String(user?.mobile || user?.mobileNo || prev.mobileNumber),
      emailId: String(user?.email || prev.emailId),
    }));
  }, [user]);

  function showToast(message: string) {
    setToastMessage(message);
    setToastVisible(true);
    window.setTimeout(() => {
      setToastVisible(false);
    }, 3500);
  }

  function downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function isJkkBooking(ticket: any): boolean {
    if (!ticket) return false;
    if (String(ticket?.bookingSource || '').toLowerCase() === 'jkk') return true;
    const name = String(ticket?.placeName || ticket?.placeDetailDto?.name || '').toLowerCase();
    return name.includes('jawahar') || name.includes('jkk');
  }

  function isInventoryTicket(ticket: any): boolean {
    if (!ticket) return false;
    if (ticket?.inventory || ticket?.inventoryId || ticket?.inventory?.id) return true;
    if (ticket?.zoneName || ticket?.inventory?.zoneName) return true;
    return false;
  }

  async function handleDownloadGeneratedTicket() {
    if (!form.bookingId) return;
    setTicketDownloading(true);
    setTicketDownloadBookingId(form.bookingId);
    setTicketDownloadRequested(true);
  }

  useEffect(() => {
    if (!ticketDownloadRequested) return;
    const result = downloadTicketQuery.data?.result;
    if (!result) return;
    setTicketDownloadRequested(false);
    const ticket =
      result?.ticketBookingDetailDtos?.[0] ??
      result?.boardingPassDetailDtos?.[0] ??
      result;
    if (!ticket) {
      showErrorToastMessage('Ticket data not available');
      setTicketDownloading(false);
      return;
    }
    (async () => {
      try {
        const file = isJkkBooking(ticket)
          ? await buildJkkShareFile(ticket)
          : isInventoryTicket(ticket)
            ? await buildInventoryShareFile(ticket)
            : await buildSandstoneShareFile(ticket);
        downloadFile(file);
      } catch {
        showErrorToastMessage('Failed to generate ticket. Please try again.');
      } finally {
        setTicketDownloading(false);
      }
    })();
  }, [downloadTicketQuery.data?.result, ticketDownloadRequested]);

  function updateForm<K extends keyof QueryFormState>(key: K, value: QueryFormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function resetModalForm() {
    setForm(buildInitialForm(user));
    setFormErrors({});
  }

  function handleOpenNewQuery() {
    resetModalForm();
    setNewQueryOpen(true);
  }

  function handleCloseNewQuery() {
    setNewQueryOpen(false);
    resetModalForm();
  }

  function handleOpenDrawer(id: string) {
    setSelectedId(id);
    setChatText('');
    setSectionsCollapsed({
      user: false,
      description: false,
      attachment: false,
    });
  }

  function handleCloseDrawer() {
    setSelectedId(null);
    setChatText('');
  }

  function toggleSection(key: DetailSectionKey) {
    setSectionsCollapsed((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const dotCount = (file.name.match(/\./g) || []).length;
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (dotCount > 1) {
      showErrorToastMessage('Invalid file name. Multiple dots are not allowed.');
      event.currentTarget.value = '';
      return;
    }

    if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(file.type)) {
      showErrorToastMessage('Only JPG, PNG, or PDF files are allowed.');
      event.currentTarget.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showErrorToastMessage('File size must be under 2MB.');
      event.currentTarget.value = '';
      return;
    }

    try {
      const formData = new FormData();
      formData.append('imageOrPdf', file);
      const response: any = await attachmentMutation.mutateAsync(formData);
      const fileUrl = response?.result?.[0] || response?.result?.url || response?.result || '';

      if (!fileUrl || typeof fileUrl !== 'string') {
        showErrorToastMessage('Upload succeeded but file URL was missing.');
      } else {
        updateForm('attachmentUrl', fileUrl);
        updateForm('attachmentName', file.name);
      }
    } catch {
      showErrorToastMessage('File upload failed.');
    } finally {
      event.currentTarget.value = '';
    }
  }

  function validateForm() {
    const nextErrors: QueryFormErrors = {};

    if (!form.userName.trim()) nextErrors.userName = 'Please enter your name.';
    if (!/^\d{10}$/.test(form.mobileNumber.trim())) {
      nextErrors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }
    if (!form.placeId) nextErrors.placeId = 'Please select a place.';
    if (!form.ticketType) nextErrors.ticketType = 'Please select an issue type.';
    if (!form.description.trim()) nextErrors.description = 'Please describe the issue.';
    if (!bookingIsOptional && !form.bookingId) {
      nextErrors.bookingId = 'Please select a booking ID.';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmitTicket() {
    if (!validateForm()) return;

    const payload = {
      ticketTitle: '',
      userName: form.userName.trim(),
      mobileNumber: form.mobileNumber.trim(),
      emailId: form.emailId.trim().replace(/\s/g, ''),
      ticketType: form.ticketType,
      placeType: form.placeType,
      subTicketType: form.subTicketType,
      issueTypeId: form.issueTypeId,
      issueSubTypeId: form.issueSubTypeId,
      bookingId: bookingIsOptional ? '' : form.bookingId,
      cancellationReason: '',
      description: form.description.trim(),
      attachmentFile: form.attachmentUrl,
      placeId: form.placeId,
    };

    createTicketMutation.mutate(payload, {
      onSuccess: (response: any) => {
        const createdTicket = response?.result
          ? normalizeTicket(response.result)
          : {
              id: `local-${Date.now()}`,
              issueType: payload.ticketType || 'N/A',
              ticketNo: String(response?.helpTicketId || response?.ticketNo || `TEMP-${Date.now()}`),
              bookingNo: payload.bookingId || 'N/A',
              raisedAt: formatDateTime(Date.now()),
              status: 'ongoing' as const,
              badgeClass: STATUS_META.ongoing.badgeClass,
              badgeLabel: STATUS_META.ongoing.badgeLabel,
              subject: payload.ticketType || 'Support Query',
              description: payload.description,
              user: {
                name: payload.userName,
                email: payload.emailId || 'N/A',
                mobile: payload.mobileNumber,
              },
              attachment: payload.attachmentFile || null,
              chatStatus: STATUS_META.ongoing.chatStatus,
              notificationCount: 0,
            };

        setLocalTickets((prev) => {
          const next = [createdTicket, ...prev.filter((ticket) => ticket.id !== createdTicket.id)];
          return next;
        });
        setCurrentTab('ongoing');
        setNewQueryOpen(false);
        setForm(buildInitialForm(user));
        setFormErrors({});
        showToast('Your ticket has been submitted successfully.');
      },
    });
  }

  function handleSendMessage() {
    if (!selectedGrievance) return;

    const text = chatText.trim();
    if (!text) return;

    const tempId = `local-message-${Date.now()}`;
    const optimisticMessage: GrievanceMessage = {
      id: tempId,
      from: 'user',
      name: String(user?.name || user?.displayName || user?.fullName || selectedGrievance.user.name || 'You'),
      text,
      time: formatClock(Date.now()),
      date: formatDayLabel(Date.now()),
    };

    setLocalMessages((prev) => ({
      ...prev,
      [selectedGrievance.id]: [...(prev[selectedGrievance.id] || []), optimisticMessage],
    }));
    setChatText('');

    messageMutation.mutate(
      {
        helpTicketId: selectedGrievance.ticketNo,
        messages: text,
        ticketType: selectedGrievance.issueType,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKeys.getAllHelpDeskListing] });
          queryClient.invalidateQueries({ queryKey: [queryKeys.getHelpDeskChatById, selectedGrievance.id] });
        },
        onError: () => {
          setLocalMessages((prev) => ({
            ...prev,
            [selectedGrievance.id]: (prev[selectedGrievance.id] || []).filter(
              (message) => message.id !== tempId,
            ),
          }));
        },
      },
    );
  }

  const currentListLoading =
    currentTab === 'ongoing'
      ? ongoingQuery.isLoading
      : currentTab === 'resolved'
      ? resolvedQuery.isLoading
      : cancelledQuery.isLoading;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1>My Grievance</h1>
            <p>Track and manage your support queries and complaints</p>
          </div>
          <button className="btn-p" onClick={handleOpenNewQuery}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ width: 15, height: 15 }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Query
          </button>
        </div>
      </div>

      <div className="stats-strip">
        <div className="stats-strip-item">
          <div className="ssi-num">{stats.total}</div>
          <div className="ssi-lbl">Total</div>
        </div>
        <div className="stats-strip-item">
          <div className="ssi-num orange">{stats.totalOngoing}</div>
          <div className="ssi-lbl">Ongoing</div>
        </div>
        <div className="stats-strip-item">
          <div className="ssi-num green">{stats.totalResolved}</div>
          <div className="ssi-lbl">Resolved</div>
        </div>
        <div className="stats-strip-item">
          <div className="ssi-num red">{stats.totalCancelled}</div>
          <div className="ssi-lbl">Cancelled</div>
        </div>
      </div>

      <div className="tabs-wrap">
        <button
          className={`tab-pill ${currentTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setCurrentTab('ongoing')}
        >
          Ongoing
        </button>
        <button
          className={`tab-pill ${currentTab === 'resolved' ? 'active' : ''}`}
          onClick={() => setCurrentTab('resolved')}
        >
          Resolved
        </button>
        <button
          className={`tab-pill ${currentTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setCurrentTab('cancelled')}
        >
          Cancelled
        </button>
      </div>

      <div className="grievances-body">
        {currentListLoading ? (
          <div className="empty-state">
            <div className="empty-title">Loading queries</div>
            <div className="empty-sub">Please wait while we fetch your grievance history.</div>
          </div>
        ) : currentList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">
              No {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Queries
            </div>
            <div className="empty-sub">You do not have any {currentTab} grievances right now.</div>
            <button className="btn-p" onClick={handleOpenNewQuery}>
              New Query
            </button>
          </div>
        ) : (
          currentList.map((grievance) => (
            <div key={grievance.id} className="g-card">
              <div className="g-card-header">
                <div className="g-card-title">
                  <span>{grievance.subject}</span>
                </div>
                <span className={`g-badge ${grievance.badgeClass}`}>{grievance.badgeLabel}</span>
              </div>

              <div className="g-card-body">
                <div className="g-grid">
                  <div className="g-field">
                    <div className="g-field-lbl">Issue Type</div>
                    <div className="g-field-val">{grievance.issueType}</div>
                  </div>
                  <div className="g-field">
                    <div className="g-field-lbl">Ticket No</div>
                    <div className="g-field-val mono">{grievance.ticketNo}</div>
                  </div>
                  <div className="g-field">
                    <div className="g-field-lbl">Booking No</div>
                    <div className="g-field-val mono">{grievance.bookingNo}</div>
                  </div>
                  <div className="g-field">
                    <div className="g-field-lbl">Raised Date &amp; Time</div>
                    <div className="g-field-val">{grievance.raisedAt}</div>
                  </div>
                </div>
              </div>

              <div className="g-card-footer">
                <span className="g-foot-left">
                  Query ID: <strong>{grievance.id}</strong>
                </span>
                <div className="g-foot-right">
                  {grievance.notificationCount > 0 ? (
                    <span
                      style={{
                        marginRight: 2,
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: '1px solid var(--bdr)',
                        background: '#fff',
                        color: 'var(--sf)',
                        flexShrink: 0,
                      }}
                      title={`${grievance.notificationCount} unread notification${grievance.notificationCount > 1 ? 's' : ''}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 15, height: 15 }}>
                        <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                        <path d="M10 20a2 2 0 0 0 4 0" />
                      </svg>
                      <span
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          minWidth: 18,
                          height: 18,
                          padding: '0 4px',
                          borderRadius: 999,
                          background: '#DC2626',
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1,
                        }}
                      >
                        {grievance.notificationCount > 99 ? '99+' : grievance.notificationCount}
                      </span>
                    </span>
                  ) : null}
                  <button className="btn-view-detail" onClick={() => handleOpenDrawer(grievance.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View Details
                  </button>
                  <span className={`g-badge ${grievance.badgeClass}`}>{grievance.badgeLabel}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div
        className={`modal-overlay ${newQueryOpen ? 'open' : ''}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) handleCloseNewQuery();
        }}
      >
        <div className="modal" role="dialog" aria-modal="true" aria-label="New Query">
          <div className="modal-top">
            <div className="modal-top-text">
              <h2>Welcome Guest</h2>
              <p>Please provide your information to continue</p>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              onClick={handleCloseNewQuery}
              aria-label="Close"
            >
              x
            </button>
          </div>

          <div className="modal-body">
            <div className="section-heading">
              <div className="section-number">1</div>
              <h3>Personal Information</h3>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  Mobile Number <span className="req">*</span>
                </label>
                <div className="phone-input-wrap">
                  <span className="phone-prefix">IN +91</span>
                  <input
                    type="tel"
                    className="phone-input-inner"
                    placeholder="Enter mobile number"
                    value={form.mobileNumber}
                    maxLength={10}
                    onChange={(event) => updateForm('mobileNumber', event.target.value.replace(/\D/g, ''))}
                  />
                </div>
                {formErrors.mobileNumber ? <p className="error-text">{formErrors.mobileNumber}</p> : null}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  Full Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your full name"
                  value={form.userName}
                  onChange={(event) => updateForm('userName', event.target.value)}
                />
                {formErrors.userName ? <p className="error-text">{formErrors.userName}</p> : null}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter email address"
                  style={{ paddingLeft: 36 }}
                  value={form.emailId}
                  onChange={(event) => updateForm('emailId', event.target.value.replace(/\s/g, ''))}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: 13,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 14,
                    color: 'var(--mu)',
                  }}
                >
                  @
                </span>
              </div>
            </div>

            <div className="form-divider" />

            <div className="section-heading">
              <div className="section-number">2</div>
              <h3>Issue / Feedback Details</h3>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  Select Place <span className="req">*</span>
                </label>
                <div className="select-wrap">
                  <select
                    className="form-select"
                    value={form.placeId}
                    onChange={(event) => {
                      const place = places.find((item: any) => String(item?.id) === event.target.value);
                      setForm((prev) => ({
                        ...prev,
                        placeId: String(place?.id || ''),
                        placeType: String(place?.name || ''),
                        ticketType: '',
                        subTicketType: '',
                        issueTypeId: '',
                        issueSubTypeId: '',
                        bookingId: '',
                      }));
                      setFormErrors((prev) => {
                        const next = { ...prev };
                        delete next.placeId;
                        delete next.ticketType;
                        delete next.bookingId;
                        return next;
                      });
                    }}
                  >
                    <option value="">Choose location</option>
                    {places.map((place: any) => (
                      <option key={place?.id} value={String(place?.id)}>
                        {String(place?.name || 'Unnamed Place')}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.placeId ? <p className="error-text">{formErrors.placeId}</p> : null}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  Issue Category <span className="req">*</span>
                </label>
                <div className="select-wrap">
                  <select
                    className="form-select"
                    value={form.issueTypeId}
                    onChange={(event) => {
                      const issue = issueTypes.find((item: any) => String(item?.id) === event.target.value);
                      setForm((prev) => ({
                        ...prev,
                        issueTypeId: String(issue?.id || ''),
                        ticketType: String(issue?.issueType || issue?.name || ''),
                        subTicketType: '',
                        issueSubTypeId: '',
                        bookingId: '',
                      }));
                      setFormErrors((prev) => {
                        const next = { ...prev };
                        delete next.ticketType;
                        delete next.bookingId;
                        return next;
                      });
                    }}
                    disabled={!form.placeId}
                  >
                    <option value="">Select issue type</option>
                    {issueTypes.map((issue: any) => (
                      <option key={issue?.id} value={String(issue?.id)}>
                        {String(issue?.issueType || issue?.name || issue?.label || 'Issue')}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.ticketType ? <p className="error-text">{formErrors.ticketType}</p> : null}
              </div>
            </div>

            {subIssueTypes.length > 0 ? (
              <div className="form-group">
                <label className="form-label">Sub Issue Type</label>
                <div className="select-wrap">
                  <select
                    className="form-select"
                    value={form.issueSubTypeId}
                    onChange={(event) => {
                      const subIssue = subIssueTypes.find(
                        (item: any) => String(item?.id || item?._id) === event.target.value,
                      );
                      setForm((prev) => ({
                        ...prev,
                        issueSubTypeId: String(subIssue?.id || subIssue?._id || ''),
                        subTicketType: String(subIssue?.name || subIssue?.label || ''),
                      }));
                    }}
                  >
                    <option value="">Select sub-category</option>
                    {subIssueTypes.map((subIssue: any) => (
                      <option key={String(subIssue?.id || subIssue?._id)} value={String(subIssue?.id || subIssue?._id)}>
                        {String(subIssue?.label || subIssue?.name || 'Sub Issue')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

            <div className="form-group">
              <label className="form-label">
                Booking ID {!bookingIsOptional ? <span className="req">*</span> : null}
              </label>
              <div className="select-wrap">
                <select
                  className="form-select"
                  value={form.bookingId}
                  onChange={(event) => {
                    updateForm('bookingId', event.target.value);
                    setTicketDownloadRequested(false);
                    setTicketDownloading(false);
                  }}
                  disabled={!bookingIsOptional && !form.issueTypeId}
                >
                  <option value="">{bookingIsOptional ? 'Select Booking Id (Optional)' : 'Select Booking Id'}</option>
                  {bookingOptions.map((booking: any) => {
                    const bookingId = String(booking?.bookingId || booking?.id || '');
                    const bookingLabel =
                      bookingId ||
                      String(booking?.bookingNumber || booking?.displayBookingId || '');

                    return (
                      <option key={bookingId || bookingLabel} value={bookingId}>
                        {bookingLabel || 'Booking'}
                      </option>
                    );
                  })}
                </select>
              </div>
              {formErrors.bookingId ? <p className="error-text">{formErrors.bookingId}</p> : null}
              {!bookingIsOptional &&
              form.issueTypeId &&
              bookingOptions.length === 0 &&
              !bookingFilterQuery.isLoading ? (
                <p className="error-text">No booking IDs found for the selected issue type.</p>
              ) : null}
              {form.ticketType === 'TICKET' && form.bookingId ? (
                (() => {
                  const issue = userIssueQuery.data?.result?.helpDeskUserIssueOn;
                  const isGenerated =
                    issue?.issueType === 'TICKET' && String(issue?.status || '').toUpperCase() === 'SUCCESS';
                  if (!isGenerated) return null;
                  return (
                    <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: '#2C2017' }}>
                      Your TICKET is successfully Generated.{' '}
                      <button
                        type="button"
                        onClick={() => void handleDownloadGeneratedTicket()}
                        disabled={ticketDownloading}
                        style={{
                          appearance: 'none',
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          margin: 0,
                          cursor: ticketDownloading ? 'not-allowed' : 'pointer',
                          color: '#2563EB',
                          textDecoration: 'underline',
                          fontWeight: 700,
                        }}
                      >
                        {ticketDownloading ? 'Preparing…' : 'Click here to download'}
                      </button>
                    </div>
                  );
                })()
              ) : null}
            </div>

            <div className="form-group">
              <label className="form-label">
                Description <span className="req">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <textarea
                  className="form-textarea"
                  placeholder="Please describe your issue in detail..."
                  rows={4}
                  value={form.description}
                  onChange={(event) => updateForm('description', event.target.value)}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: 13,
                    bottom: 12,
                    fontSize: 16,
                    color: 'var(--mu)',
                    opacity: 0.4,
                  }}
                >
                  ?
                </span>
              </div>
              {formErrors.description ? <p className="error-text">{formErrors.description}</p> : null}
            </div>

            <div className="form-group">
              <label className="form-label">Attachment</label>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <label className="attach-btn">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ width: 14, height: 14 }}
                  >
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  {attachmentMutation.isPending ? 'Uploading...' : 'Choose File'}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    disabled={attachmentMutation.isPending}
                  />
                </label>
                <span className="attach-hint">Max 2MB (JPG, PNG, PDF)</span>
                {form.attachmentName ? (
                  <span style={{ fontSize: 11, color: 'var(--sf)', fontWeight: 600 }}>
                    {form.attachmentName}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel-modal" onClick={handleCloseNewQuery}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-submit-ticket"
              onClick={handleSubmitTicket}
              disabled={createTicketMutation.isPending}
            >
              {createTicketMutation.isPending ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`drawer-overlay ${selectedGrievance ? 'open' : ''}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) handleCloseDrawer();
        }}
      >
        <div className="drawer-panel">
          <div className="drawer-close-bar">
            <button
              type="button"
              className="drawer-close-btn"
              onClick={handleCloseDrawer}
              aria-label="Close"
            >
              &lt;
            </button>
            <span className="drawer-close-title">Query Tickets</span>
            {selectedGrievance ? (
              <span className={`g-badge ${selectedGrievance.badgeClass}`} style={{ fontSize: 11 }}>
                {selectedGrievance.badgeLabel}
              </span>
            ) : null}
          </div>

          {selectedGrievance ? (
            <div className="drawer-content">
              <div className="qt-header">
                <div className="qt-title-row">
                  <div>
                    <div className="qt-title">{selectedGrievance.subject}</div>
                    <div className="qt-sub">
                      Ticket #{selectedGrievance.ticketNo} | Raised {selectedGrievance.raisedAt}
                    </div>
                  </div>
                </div>
              </div>

              <div className="chat-wrap">
                <div className="chat-left">
                  <div className="chat-messages">
                    {chatQuery.isLoading ? (
                      <div className="chat-empty">
                        <div className="chat-empty-text">Loading chat...</div>
                      </div>
                    ) : chatMessages.length > 0 ? (
                      chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={message.from === 'user' ? 'msg-user' : 'msg-support'}
                        >
                          <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                            {message.name}
                          </div>
                          {message.text}
                          <div className="msg-time">
                            {message.time} | {message.date}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="chat-empty">
                        <div className="chat-empty-text">No chat found</div>
                      </div>
                    )}
                  </div>

                  <div className="chat-input-bar">
                    <input
                      className="chat-input"
                      type="text"
                      placeholder="Type your message..."
                      value={chatText}
                      onChange={(event) => setChatText(event.target.value)}
                      disabled={selectedGrievance.status !== 'ongoing' || messageMutation.isPending}
                    />
                    <button
                      type="button"
                      className="chat-send-btn"
                      onClick={handleSendMessage}
                      disabled={selectedGrievance.status !== 'ongoing' || messageMutation.isPending}
                      style={
                        selectedGrievance.status !== 'ongoing'
                          ? { opacity: 0.4, cursor: 'not-allowed' }
                          : undefined
                      }
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="chat-right">
                  <div className="detail-user-row">
                    <div className="detail-avatar">{selectedGrievance.user.name.charAt(0)}</div>
                    <div>
                      <div className="detail-user-name">{selectedGrievance.user.name}</div>
                      <div className="detail-user-role">Registered User</div>
                    </div>
                    <div className="detail-status-pill">
                      <span className="g-badge badge-scheduled">{selectedGrievance.chatStatus}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <button
                      type="button"
                      className={`detail-section-header ${sectionsCollapsed.user ? 'collapsed' : ''}`}
                      onClick={() => toggleSection('user')}
                    >
                      <h4>User Info</h4>
                      <span className="toggle-ico">^</span>
                    </button>
                    <div
                      className="detail-section-body"
                      style={sectionsCollapsed.user ? { display: 'none' } : undefined}
                    >
                      <div className="di-row">
                        <span className="di-key">Email ID</span>
                        <span className="di-val highlight">{selectedGrievance.user.email}</span>
                      </div>
                      <div className="di-row">
                        <span className="di-key">Mobile Number</span>
                        <span className="di-val highlight">{selectedGrievance.user.mobile}</span>
                      </div>
                      <div className="di-row">
                        <span className="di-key">Issue Type</span>
                        <span className="di-val">{selectedGrievance.issueType}</span>
                      </div>
                      <div className="di-row">
                        <span className="di-key">Booking Number</span>
                        <span className="di-val highlight">{selectedGrievance.bookingNo}</span>
                      </div>
                      <div className="di-row">
                        <span className="di-key">Ticket Number</span>
                        <span className="di-val highlight">{selectedGrievance.ticketNo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <button
                      type="button"
                      className={`detail-section-header ${
                        sectionsCollapsed.description ? 'collapsed' : ''
                      }`}
                      onClick={() => toggleSection('description')}
                    >
                      <h4>Description</h4>
                      <span className="toggle-ico">^</span>
                    </button>
                    <div
                      className="detail-section-body"
                      style={sectionsCollapsed.description ? { display: 'none' } : undefined}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color: 'var(--sf)',
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        {selectedGrievance.subject}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.65 }}>
                        {selectedGrievance.description}
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <button
                      type="button"
                      className={`detail-section-header ${
                        sectionsCollapsed.attachment ? 'collapsed' : ''
                      }`}
                      onClick={() => toggleSection('attachment')}
                    >
                      <h4>Attachment</h4>
                      <span className="toggle-ico">^</span>
                    </button>
                    <div
                      className="detail-section-body"
                      style={sectionsCollapsed.attachment ? { display: 'none' } : undefined}
                    >
                      {selectedGrievance.attachment ? (
                        <div className="attachment-row">
                          <span>{getAttachmentName(selectedGrievance.attachment)}</span>
                          <button
                            type="button"
                            className="attachment-view-btn"
                            onClick={() => window.open(selectedGrievance.attachment || '', '_blank')}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: 'var(--mu)', padding: '4px 0' }}>
                          No attachments
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className={`toast ${toastVisible ? 'show' : ''}`}>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}

export default function MyGrievancePage() {
  const { user, openLoginModal } = useAuth();

  if (!user) {
    return <LoginEmptyState openLoginModal={openLoginModal} />;
  }

  return <MyGrievanceContent user={user} />;
}
