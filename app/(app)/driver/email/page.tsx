"use client"

import { useState } from "react"
import {
  Send,
  CheckCircle2,
  Loader2,
  Copy,
  ChevronRight,
} from "lucide-react"
import { DEMO_CONTACTS, DEMO_LOAD } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const gapLeg = DEMO_LOAD.legs[2]

export default function EmailOutreachPage() {
  const [sentEmails, setSentEmails] = useState<Set<string>>(new Set())
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [activeContact, setActiveContact] = useState(DEMO_CONTACTS[0])
  const [copied, setCopied] = useState(false)

  const handleSend = (contactId: string) => {
    setSendingId(contactId)
    setTimeout(() => {
      setSentEmails((prev) => new Set(prev).add(contactId))
      setSendingId(null)
    }, 1200)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${email.subject}\n\n${email.body}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const email = {
    subject: `Quick coverage need: ${gapLeg.origin} > ${gapLeg.destination} (${gapLeg.miles} mi)`,
    body: `Hi ${activeContact.name},

Hope you're doing well. I have a relay leg that needs coverage \u2014 ${gapLeg.origin} to ${gapLeg.destination}, ${gapLeg.miles} miles, picking up ${gapLeg.estimatedPickup}. Paying $${(gapLeg.rateCents / 100).toLocaleString()} ($${(gapLeg.rateCents / 100 / gapLeg.miles).toFixed(2)}/mi).

Last time we worked together was ${activeContact.lastWorkedDate} on ${activeContact.lastLoad} \u2014 great experience. Would love to work with you or someone from ${activeContact.company} again on this one.

Can you check availability? Happy to discuss details.

Best,
Marcus Thompson
FreightBite Driver Network`,
  }

  const isSent = sentEmails.has(activeContact.id)
  const isSending = sendingId === activeContact.id

  return (
    <div className="flex flex-col gap-6">
      {/* Gap context strip */}
      <div className="rounded-2xl bg-warning/10 border border-warning/20 px-5 py-4">
        <p className="text-xs font-bold text-warning uppercase tracking-widest mb-1">
          Gap on Leg 3
        </p>
        <p className="text-sm text-foreground font-bold">
          {gapLeg.origin} {">"} {gapLeg.destination}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {gapLeg.miles} mi &middot; ${(gapLeg.rateCents / 100).toLocaleString()} &middot; Pickup {gapLeg.estimatedPickup}
        </p>
      </div>

      {/* Broker selector - horizontal scroll, large tap targets */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Your Contacts ({sentEmails.size}/{DEMO_CONTACTS.length} sent)
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5">
          {DEMO_CONTACTS.map((contact) => {
            const sent = sentEmails.has(contact.id)
            const isActive = activeContact.id === contact.id

            return (
              <button
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className={cn(
                  "shrink-0 rounded-2xl border-2 p-4 min-w-[180px] text-left transition-colors min-h-[56px]",
                  isActive
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card active:bg-secondary"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-foreground">{contact.name.split(" ")[0]}</p>
                  {sent && <CheckCircle2 className="h-4 w-4 text-success" />}
                </div>
                <p className="text-[10px] text-muted-foreground">{contact.company}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Last: {contact.lastWorkedDate}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Broker context - personal info above the draft */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            {activeContact.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <p className="text-base font-bold text-foreground">{activeContact.name}</p>
            <p className="text-xs text-muted-foreground">{activeContact.company}</p>
          </div>
          {isSent && (
            <span className="ml-auto rounded-lg bg-success/15 text-success text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              Sent
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ChevronRight className="h-3 w-3" />
          <span>
            Last worked: <span className="text-foreground font-medium">{activeContact.lastLoad}</span> in {activeContact.lastWorkedDate}
          </span>
        </div>
      </div>

      {/* Email draft - looks like a real email, not a form */}
      <div className="rounded-2xl border border-border overflow-hidden">
        {/* Email header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider w-10">To</span>
              <span className="text-sm text-foreground">{activeContact.email}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider w-10">Subj</span>
              <span className="text-sm text-foreground font-medium">{email.subject}</span>
            </div>
          </div>
        </div>

        {/* Email body - looks like a composed email */}
        <div className="bg-card/50 px-5 py-5">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/85">
            {email.body}
          </pre>
        </div>
      </div>

      {/* Actions - Send or Copy, nothing else */}
      {!isSent ? (
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="rounded-2xl bg-secondary text-foreground font-bold text-sm px-5 py-4 min-h-[56px] flex items-center justify-center gap-2 active:bg-border transition-colors"
          >
            {copied ? <CheckCircle2 className="h-4.5 w-4.5 text-success" /> : <Copy className="h-4.5 w-4.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={() => handleSend(activeContact.id)}
            disabled={isSending}
            className="flex-1 rounded-2xl bg-success text-success-foreground font-bold text-base py-4 min-h-[56px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {isSending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Send to {activeContact.name.split(" ")[0]}
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-success/10 border border-success/20 py-4 min-h-[56px] text-success font-bold">
          <CheckCircle2 className="h-5 w-5" />
          Sent to {activeContact.name}
        </div>
      )}
    </div>
  )
}
