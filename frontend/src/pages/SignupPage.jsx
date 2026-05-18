import { useMemo, useState } from 'react';
import { signup } from '../api/authApi.js';

const initialForm = {
  nickname: '',
  email: '',
  password: '',
  passwordConfirm: '',
  phone: '',
  address: '',
  acceptedTerms: false,
};

const validators = {
  nickname: (value) => value.trim().length >= 2,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
  phone: (value) => /^010-\d{4}-\d{4}$/.test(value),
  address: (value) => value.trim().length >= 5,
};

function formatPhone(value) {
  return value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, '$1-$2-$3')
    .slice(0, 13);
}

function getHintClass(isDirty, isValid) {
  if (!isDirty) return 'signup-hint';
  return isValid ? 'signup-hint valid' : 'signup-hint invalid';
}

export default function SignupPage() {
  const [form, setForm] = useState(initialForm);
  const [dirty, setDirty] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validity = useMemo(() => {
    const passwordConfirm = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

    return {
      nickname: validators.nickname(form.nickname),
      email: validators.email(form.email),
      password: validators.password(form.password),
      passwordConfirm,
      phone: validators.phone(form.phone),
      address: validators.address(form.address),
      acceptedTerms: form.acceptedTerms,
    };
  }, [form]);

  const isFormValid = Object.values(validity).every(Boolean);

  function updateField(event) {
    const { name, type, value, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setForm((current) => ({
      ...current,
      [name]: name === 'phone' ? formatPhone(nextValue) : nextValue,
    }));
    setDirty((current) => ({ ...current, [name]: true }));
    setMessage(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setDirty({
      nickname: true,
      email: true,
      password: true,
      passwordConfirm: true,
      phone: true,
      address: true,
      acceptedTerms: true,
    });

    if (!isFormValid) {
      setMessage({ type: 'error', text: 'Please check the signup form again.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      await signup({
        nickname: form.nickname.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim(),
        address: form.address.trim(),
        acceptedTerms: form.acceptedTerms,
      });

      setForm(initialForm);
      setDirty({});
      setMessage({ type: 'success', text: 'Signup completed. Please log in.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="signup-page">
      <a className="home-link" href="/">
        Home
      </a>

      <section className="signup-panel" aria-labelledby="signup-title">
        <h1 id="signup-title">Sign up</h1>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Nickname</span>
            <input
              name="nickname"
              value={form.nickname}
              onChange={updateField}
              placeholder="Nickname"
              autoComplete="nickname"
            />
            <small className={getHintClass(dirty.nickname, validity.nickname)}>At least 2 characters</small>
          </label>

          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="user@example.com"
              autoComplete="email"
            />
            <small className={getHintClass(dirty.email, validity.email)}>Use a valid email address</small>
          </label>

          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={updateField}
              placeholder="Password1!"
              autoComplete="new-password"
            />
            <small className={getHintClass(dirty.password, validity.password)}>
              8+ characters with letters, numbers, and symbols
            </small>
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              name="passwordConfirm"
              type={showPassword ? 'text' : 'password'}
              value={form.passwordConfirm}
              onChange={updateField}
              placeholder="Confirm password"
              autoComplete="new-password"
            />
            <small className={getHintClass(dirty.passwordConfirm, validity.passwordConfirm)}>
              Passwords must match
            </small>
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            <span>Show passwords</span>
          </label>

          <label className="field">
            <span>Phone</span>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={updateField}
              placeholder="010-0000-0000"
              autoComplete="tel"
            />
            <small className={getHintClass(dirty.phone, validity.phone)}>Use 010-XXXX-XXXX format</small>
          </label>

          <label className="field">
            <span>Address</span>
            <input
              name="address"
              value={form.address}
              onChange={updateField}
              placeholder="Address"
              autoComplete="street-address"
            />
            <small className={getHintClass(dirty.address, validity.address)}>At least 5 characters</small>
          </label>

          <label className="check-row">
            <input
              name="acceptedTerms"
              type="checkbox"
              checked={form.acceptedTerms}
              onChange={updateField}
            />
            <span>I accept the terms</span>
          </label>

          {message && <p className={`form-message ${message.type}`}>{message.text}</p>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  );
}
