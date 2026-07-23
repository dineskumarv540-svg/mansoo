import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import {
  fetchUserDrafts,
  deleteDraft,
  restoreDraft,
  getTrashDrafts
} from '../services/draftService';

export default function DraftsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'trash'
  const [searchQuery, setSearchQuery] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [trashDrafts, setTrashDrafts] = useState([]);

  useEffect(() => {
    loadDraftsData();
  }, [activeTab]);

  const loadDraftsData = async () => {
    const active = await fetchUserDrafts('u1');
    const trash = getTrashDrafts();
    setDrafts([...active]);
    setTrashDrafts([...trash]);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleDelete = async (draftId) => {
    Alert.alert(
      'Move to Trash',
      'Move this draft to Trash? You can restore it anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Move to Trash',
          style: 'destructive',
          onPress: async () => {
            await deleteDraft(draftId);
            await loadDraftsData();
          }
        }
      ]
    );
  };

  const handleRestore = async (draftId) => {
    await restoreDraft(draftId);
    await loadDraftsData();
    Alert.alert('Draft Restored ✨', 'Your draft has been restored to active drafts.');
  };

  const handleEditDraft = (draft) => {
    navigation.navigate('Create', { editPost: draft });
  };

  const currentList = activeTab === 'active' ? drafts : trashDrafts;

  const filteredList = currentList.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return d.quoteText.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Draft Manager</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Create')}>
          <Ionicons name="add-circle" size={26} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search drafts by text or category..."
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Ionicons name="document-text-outline" size={16} color={activeTab === 'active' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active ({drafts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'trash' && styles.tabActive]}
          onPress={() => setActiveTab('trash')}
        >
          <Ionicons name="trash-outline" size={16} color={activeTab === 'trash' ? COLORS.accent : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'trash' && styles.tabTextActive]}>
            Trash ({trashDrafts.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Draft List */}
      <FlatList
        data={filteredList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.draftCard}>
            <View style={styles.draftHeaderRow}>
              <View style={styles.catChip}>
                <Text style={styles.catChipText}>{item.category}</Text>
              </View>

              <View style={[styles.statusBadge, item.status === 'Synced' ? styles.statusSynced : styles.statusLocal]}>
                <Text style={[styles.statusText, item.status === 'Synced' ? styles.statusTextSynced : styles.statusTextLocal]}>
                  {item.status === 'Synced' ? '☁️ Synced' : '💾 Local'}
                </Text>
              </View>
            </View>

            <Text style={styles.quoteSnippet} numberOfLines={2}>
              "{item.quoteText || 'Empty draft...'}"
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.timeText}>Saved {item.updatedAtText || 'Recently'}</Text>

              <View style={styles.actionsRow}>
                {activeTab === 'active' ? (
                  <>
                    <TouchableOpacity style={styles.editBtn} onPress={() => handleEditDraft(item)}>
                      <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                      <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={styles.restoreBtn} onPress={() => handleRestore(item.id)}>
                    <Ionicons name="refresh-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.restoreBtnText}>Restore</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>
              {activeTab === 'active' ? 'No active drafts found' : 'Trash is empty'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'serif',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  listContent: {
    padding: 14,
  },
  draftCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  draftHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catChip: {
    backgroundColor: '#F0F7F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  catChipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusSynced: {
    backgroundColor: '#E8F5E9',
  },
  statusLocal: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTextSynced: {
    color: '#2E7D32',
  },
  statusTextLocal: {
    color: '#E65100',
  },
  quoteSnippet: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginVertical: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 8,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 4,
  },
  deleteBtn: {
    padding: 6,
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  restoreBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
});
