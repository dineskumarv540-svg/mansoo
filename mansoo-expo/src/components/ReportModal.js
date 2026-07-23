import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { submitReport } from '../services/socialService';

const REPORT_REASONS = [
  'Spam or Commercial Ad',
  'Hate Speech & Harassment',
  'Profanity & Inappropriate Content',
  'Plagiarism & Copyright Infringement',
  'Fake Identity / Impersonation',
  'Other'
];

export default function ReportModal({ visible, targetItem, contentType = 'post', onClose }) {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!visible) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const res = await submitReport({
      contentId: targetItem?.id || 'id_placeholder',
      contentType: contentType, // 'post' | 'user' | 'comment'
      reportedByUserId: 'u1',
      reason: selectedReason,
      details: details.trim(),
    });
    setIsSubmitting(false);
    Alert.alert('Report Submitted 🛡️', res.message);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.dragHandle} />

              <View style={styles.header}>
                <Text style={styles.headerTitle}>
                  Report {contentType === 'user' ? 'User' : 'Content'}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close-circle-outline" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={styles.subText}>
                  Help keep Mansoo safe. Select why you are reporting this {contentType}:
                </Text>

                {REPORT_REASONS.map(reason => {
                  const isSelected = reason === selectedReason;
                  return (
                    <TouchableOpacity
                      key={reason}
                      style={[styles.reasonRow, isSelected && styles.reasonRowSelected]}
                      onPress={() => setSelectedReason(reason)}
                    >
                      <Ionicons
                        name={isSelected ? "radio-button-on" : "radio-button-off"}
                        size={18}
                        color={isSelected ? COLORS.accent : COLORS.textSecondary}
                      />
                      <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                        {reason}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <Text style={styles.fieldLabel}>Additional Details (Optional):</Text>
                <TextInput
                  style={styles.detailsInput}
                  placeholder="Describe the issue..."
                  placeholderTextColor="#AAAAAA"
                  multiline
                  value={details}
                  onChangeText={setDetails}
                />

                <TouchableOpacity
                  style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={styles.submitBtnText}>Submit Report</Text>
                </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    maxHeight: '85%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  subText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  reasonRowSelected: {
    backgroundColor: '#FFF0F3',
    borderColor: COLORS.accent,
  },
  reasonText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginLeft: 10,
    fontWeight: '500',
  },
  reasonTextSelected: {
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 10,
    marginBottom: 6,
  },
  detailsInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    padding: 10,
    minHeight: 70,
    fontSize: 13,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
