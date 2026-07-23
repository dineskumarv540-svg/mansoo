import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from './ui/AppButton';
import AppInput from './ui/AppInput';
import AppChip from './ui/AppChip';
import AppBadge from './ui/AppBadge';

import { fetchHelpCenterArticles, submitSupportTicket, fetchUserTickets } from '../services/supportService';
import { useAppTheme } from '../theme/ThemeContext';
import { SPACING, RADIUS, SHADOWS } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';

export default function SupportTicketModal({ visible, onClose }) {
  const { theme } = useAppTheme();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('faq'); // 'faq' | 'ticket' | 'history'
  const [faqs, setFaqs] = useState([]);
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User Tickets State
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (visible) {
      loadFaqs();
      loadTickets();
    }
  }, [visible]);

  const loadFaqs = async () => {
    const data = await fetchHelpCenterArticles();
    setFaqs(data);
  };

  const loadTickets = async () => {
    const userEmail = user?.email || 'user@mansoo.in';
    const data = await fetchUserTickets(userEmail);
    setTickets(data);
  };

  const handleSubmitTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Incomplete Form', 'Please provide a subject and detailed description.');
      return;
    }

    setIsSubmitting(true);
    const userEmail = user?.email || 'user@mansoo.in';
    const res = await submitSupportTicket({
      subject,
      category,
      description,
      userEmail,
    });
    setIsSubmitting(false);

    if (res.success) {
      Alert.alert('Ticket Submitted 🎫', res.message);
      setSubject('');
      setDescription('');
      setActiveTab('history');
      loadTickets();
    } else {
      Alert.alert('Submission Error', 'Failed to send support ticket.');
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.dragHandle} />

              <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Help Center & Support 🎧</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close-circle-outline" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Sub-navigation Chips */}
              <View style={styles.chipRow}>
                <AppChip label="FAQ & Help" selected={activeTab === 'faq'} onPress={() => setActiveTab('faq')} />
                <AppChip label="New Ticket" selected={activeTab === 'ticket'} onPress={() => setActiveTab('ticket')} />
                <AppChip label={`My Tickets (${tickets.length})`} selected={activeTab === 'history'} onPress={() => setActiveTab('history')} />
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {activeTab === 'faq' ? (
                  <View>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Frequently Asked Questions</Text>
                    {faqs.map(faq => {
                      const isExpanded = expandedFaqId === faq.id;
                      return (
                        <TouchableOpacity
                          key={faq.id}
                          style={[styles.faqCard, { backgroundColor: theme.surfaceLight, borderColor: theme.border }]}
                          onPress={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.faqHeader}>
                            <Text style={[styles.faqQuestion, { color: theme.textPrimary }]}>{faq.question}</Text>
                            <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={theme.primary} />
                          </View>
                          {isExpanded && (
                            <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>{faq.answer}</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : activeTab === 'ticket' ? (
                  <View>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Submit Support Request</Text>
                    <AppInput label="Subject *" placeholder="Brief summary of your issue" value={subject} onChangeText={setSubject} />

                    <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>Category:</Text>
                    <View style={styles.categoryRow}>
                      {['General Inquiry', 'Billing', 'Bug Report', 'Feature Request'].map(cat => (
                        <AppChip
                          key={cat}
                          label={cat}
                          selected={category === cat}
                          onPress={() => setCategory(cat)}
                          style={{ marginBottom: SPACING.xs }}
                        />
                      ))}
                    </View>

                    <AppInput label="Description *" placeholder="Describe your issue in detail..." value={description} onChangeText={setDescription} multiline />

                    <AppButton
                      title={isSubmitting ? "Submitting..." : "Submit Support Ticket 📩"}
                      onPress={handleSubmitTicket}
                      loading={isSubmitting}
                      style={{ marginTop: SPACING.md }}
                    />
                  </View>
                ) : (
                  <View>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Your Support History</Text>
                    {tickets.map(tkt => (
                      <View key={tkt.id} style={[styles.ticketCard, { backgroundColor: theme.surfaceLight, borderColor: theme.border }]}>
                        <View style={styles.tktHeader}>
                          <Text style={[styles.tktSubject, { color: theme.textPrimary }]}>{tkt.subject}</Text>
                          <AppBadge
                            label={tkt.status.toUpperCase()}
                            variant={tkt.status === 'resolved' ? 'success' : 'pro'}
                          />
                        </View>
                        <Text style={[styles.tktMeta, { color: theme.textSecondary }]}>Category: {tkt.category} • Ticket #{tkt.id}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingTop: SPACING.md,
    maxHeight: '85%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
    marginBottom: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginVertical: SPACING.md,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  faqCard: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: SPACING.xs,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: SPACING.xs,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  ticketCard: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  tktHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tktSubject: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginRight: SPACING.xs,
  },
  tktMeta: {
    fontSize: 11,
  },
});
