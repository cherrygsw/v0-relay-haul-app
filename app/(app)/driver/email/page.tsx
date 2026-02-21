"use client"

import { useState } from "react"
import {
  Mail,
  Send,
  CheckCircle2,
  Loader2,
  User,
  Sparkles,
  Eye,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DEMO_CONTACTS, DEMO_LOAD } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const gapLeg = DEMO_LOAD.legs[2]

export default function EmailOutreachPage() {
  const [sentEmails, setSentEmails] = useState<Set<string>>(new Set())
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(DEMO_CONTACTS[0].id)

  const handleSend = (contactId: string) => {
    setSendingId(contactId)
    setTimeout(() => {
      setSentEmails((prev) => new Set(prev).add(contactId))
      setSendingId(null)
    }, 1200)
  }

  const generateEmail = (contact: typeof DEMO_CONTACTS[0]) => {
    return {
      subject: `Quick coverage need: ${gapLeg.origin} > ${gapLeg.destination} (${gapLeg.miles} mi)`,
      body: `Hi ${contact.name},

Hope you're doing well. I have a relay leg that needs coverage — ${gapLeg.origin} to ${gapLeg.destination}, ${gapLeg.miles} miles, picking up ${gapLeg.estimatedPickup}. Paying $${(gapLeg.rateCents / 100).toLocaleString()} ($${(gapLeg.rateCents / 100 / gapLeg.miles).toFixed(2)}/mi).

Last time we worked together was ${contact.lastWorkedDate} on ${contact.lastLoad} — great experience. Would love to work with you or someone from ${contact.company} again on this one.

Can you check availability? Happy to discuss details.

Best,
Marcus Thompson
FreightBite Driver Network`,
    }
  }

  const previewContact = DEMO_CONTACTS.find((c) => c.id === previewId) || DEMO_CONTACTS[0]
  const previewEmail = generateEmail(previewContact)

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Network Outreach
        </p>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl font-medium text-foreground lg:text-4xl">
            Email Outreach
          </h1>
          <Badge className="rounded-full bg-warning/10 text-warning border-0 text-[10px] font-semibold">
            Gap on Leg 3
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          AI drafted personalized emails to your broker contacts for relay gap coverage
        </p>
      </div>

      {/* Gap Info */}
      <div className="rounded-2xl border border-warning/20 bg-warning/5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
              <Mail className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Relay Gap: {gapLeg.origin} {">"} {gapLeg.destination}
              </p>
              <p className="text-xs text-muted-foreground">
                {gapLeg.miles} mi &middot; ${(gapLeg.rateCents / 100).toLocaleString()} &middot; Pickup {gapLeg.estimatedPickup}
              </p>
            </div>
          </div>
          <p className="text-xs font-medium text-warning">
            {sentEmails.size}/{DEMO_CONTACTS.length} sent
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Contacts List */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-foreground">Broker Contacts</h2>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                {DEMO_CONTACTS.length} contacts
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {DEMO_CONTACTS.map((contact) => {
                const isSent = sentEmails.has(contact.id)
                const isSending = sendingId === contact.id
                const isPreview = previewId === contact.id

                return (
                  <div
                    key={contact.id}
                    onClick={() => setPreviewId(contact.id)}
                    className={cn(
                      "group cursor-pointer rounded-xl border p-5 transition-all duration-200",
                      isPreview
                        ? "border-primary/30 bg-primary/5 shadow-sm"
                        : "border-border bg-secondary/30 hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold",
                          isSent
                            ? "bg-success/10 text-success"
                            : "bg-secondary text-foreground"
                        )}>
                          {isSent ? <CheckCircle2 className="h-4 w-4" /> : contact.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{contact.name}</p>
                          <p className="text-[10px] text-muted-foreground">{contact.company}</p>
                        </div>
                      </div>
                      {isSent && (
                        <Badge className="rounded-full bg-success/10 text-success border-0 text-[9px]">
                          Sent
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <User className="h-2.5 w-2.5" />
                        {contact.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isSent ? (
                        <Button
                          size="sm"
                          className="h-8 gap-1.5 rounded-full text-xs flex-1 bg-foreground text-background hover:bg-foreground/90"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSend(contact.id)
                          }}
                          disabled={isSending}
                        >
                          {isSending ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-3 w-3" />
                              Send Email
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-success font-medium flex-1 justify-center py-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Email Delivered
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewId(contact.id)
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Email Preview */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">AI-Generated Email</h2>
                <p className="text-[10px] text-muted-foreground">Personalized using past load history</p>
              </div>
            </div>

            {/* Email Header */}
            <div className="rounded-xl border border-border bg-secondary/30 p-5 mb-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-muted-foreground uppercase tracking-[0.15em] w-12">To</span>
                  <span className="text-foreground">{previewContact.name} &lt;{previewContact.email}&gt;</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-muted-foreground uppercase tracking-[0.15em] w-12">From</span>
                  <span className="text-foreground">Marcus Thompson &lt;marcus.t@freightbite.com&gt;</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-muted-foreground uppercase tracking-[0.15em] w-12">Subj</span>
                  <span className="text-foreground font-medium">{previewEmail.subject}</span>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="rounded-xl border border-border bg-secondary/20 p-6">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/80">
                {previewEmail.body}
              </pre>
            </div>

            {/* Context */}
            <div className="mt-4 rounded-xl bg-primary/5 border border-primary/10 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-primary">AI context:</span>{" "}
                  This email references your work with {previewContact.company} on{" "}
                  {previewContact.lastLoad} in {previewContact.lastWorkedDate}.
                  The tone matches your previous successful email patterns.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              {!sentEmails.has(previewContact.id) ? (
                <Button
                  className="gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => handleSend(previewContact.id)}
                  disabled={sendingId === previewContact.id}
                >
                  {sendingId === previewContact.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send to {previewContact.name.split(" ")[0]}
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-sm text-success font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Sent to {previewContact.name}
                </div>
              )}
              <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                <ExternalLink className="h-3 w-3" />
                Edit Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
