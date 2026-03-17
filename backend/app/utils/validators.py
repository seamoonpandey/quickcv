import re


def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
    return bool(re.match(pattern, email))


def is_valid_password(password):
    """Minimum 8 characters, at least one letter and one number."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters."
    if not re.search(r'[A-Za-z]', password):
        return False, "Password must contain at least one letter."
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number."
    return True, "OK"


def sanitise_string(value):
    """Strip and limit string length to prevent bloat."""
    if isinstance(value, str):
        return value.strip()[:500]
    return ""