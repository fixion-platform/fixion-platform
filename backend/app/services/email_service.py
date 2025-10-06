# app/services/email_service.py
from __future__ import annotations
import smtplib, ssl
from email.message import EmailMessage
from typing import Optional
from app.config import (
    SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD,
    SMTP_FROM_EMAIL, SMTP_FROM_NAME
)

def send_email(to_email: str, subject: str, html: str, text: Optional[str] = None) -> None:
    """
    Sends an email using Gmail SMTP (App Password).
    Raises an exception if sending fails.
    """
    if not (SMTP_HOST and SMTP_PORT and SMTP_USERNAME and SMTP_PASSWORD and SMTP_FROM_EMAIL):
        raise RuntimeError("SMTP not configured. Check SMTP_* env in .env")

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
    msg["To"] = to_email

    # Both HTML and text for better deliverability
    if not text:
        text = "Please view this email in an HTML-capable client."
    msg.set_content(text)
    msg.add_alternative(html, subtype="html")

    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as smtp:
        smtp.ehlo()
        smtp.starttls(context=context)
        smtp.ehlo()
        smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
        smtp.send_message(msg)
