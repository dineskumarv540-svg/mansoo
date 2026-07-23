import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { validateEmail, validatePassword, validateName } from '../utils/authValidation';
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameErr, setNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr] = useState('');
  const [confirmErr, setConfirmErr] = useState('');

  const { signUp } = useAuth();

  const handleSignUp = async () => {
    const vName = validateName(name);
    const vEmail = validateEmail(email);
    const vPass = validatePassword(password);

    setNameErr(vName.message);
    setEmailErr(vEmail.message);
    setPassErr(vPass.message);

    if (password !== confirmPassword) {
      setConfirmErr('Passwords do not match');
      return;
    } else {
      setConfirmErr('');
    }

    if (!vName.isValid || !vEmail.isValid || !vPass.isValid) {
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, name);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Account Created! ✨',
        'A verification email has been sent. Please check your inbox.',
        [{ text: 'Continue', onPress: () => navigation.replace('MainTabs') }]
      );
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Bar */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Branding Header */}
          <View style={styles.brandingHeader}>
            <LinearGradient colors={COLORS.gradientGreen} style={styles.logoCircle}>
              <Text style={styles.logoLetter}>M</Text>
            </LinearGradient>
            <Text style={styles.appName}>Mansoo</Text>
            <Text style={styles.tagline}>Create your writer account</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.welcomeText}>Join Mansoo ✨</Text>
            <Text style={styles.subText}>Share your poetry, stories & quotes with the world</Text>

            {/* Name Field */}
            <View style={[styles.inputContainer, nameErr ? styles.inputError : null]}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#AAAAAA"
                value={name}
                onChangeText={(v) => { setName(v); setNameErr(''); }}
              />
            </View>
            {nameErr ? <Text style={styles.errorText}>{nameErr}</Text> : null}

            {/* Email Field */}
            <View style={[styles.inputContainer, emailErr ? styles.inputError : null]}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#AAAAAA"
                value={email}
                onChangeText={(v) => { setEmail(v); setEmailErr(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {emailErr ? <Text style={styles.errorText}>{emailErr}</Text> : null}

            {/* Password Field */}
            <View style={[styles.inputContainer, passErr ? styles.inputError : null]}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password (min 6 characters)"
                placeholderTextColor="#AAAAAA"
                value={password}
                onChangeText={(v) => { setPassword(v); setPassErr(''); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {passErr ? <Text style={styles.errorText}>{passErr}</Text> : null}

            {/* Confirm Password Field */}
            <View style={[styles.inputContainer, confirmErr ? styles.inputError : null]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#AAAAAA"
                value={confirmPassword}
                onChangeText={(v) => { setConfirmPassword(v); setConfirmErr(''); }}
                secureTextEntry={!showPassword}
              />
            </View>
            {confirmErr ? <Text style={styles.errorText}>{confirmErr}</Text> : null}

            {/* Sign Up Button */}
            <TouchableOpacity onPress={handleSignUp} activeOpacity={0.8} style={styles.signUpBtnContainer}>
              <LinearGradient colors={COLORS.gradientGreen} style={styles.signUpBtn}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.signUpBtnText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer Row */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: 4,
    marginBottom: 10,
  },
  brandingHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoLetter: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'serif',
  },
  tagline: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.error,
    marginTop: 2,
    marginLeft: 4,
  },
  signUpBtnContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
  },
  signUpBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signInText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
