"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Appel } from "@/types/appel";
import type { Commande } from "@/types/commande";
import type { Reservation } from "@/types/reservation";
import {
  playAppelCharbonAlarm,
  playAppelServeurAlarm,
  playCommandeAlarm,
  playReservationAlarm,
  requestNotificationPermission,
  showNotification,
} from "@/lib/notification-sound";

const POLL_MS = 5000;

export function AdminNotificationPoller() {
  const knownCommandeIds = useRef<Set<string>>(new Set());
  const knownAppelIds = useRef<Set<string>>(new Set());
  const knownReservationIds = useRef<Set<string>>(new Set());
  const commandesReady = useRef(false);
  const appelsReady = useRef(false);
  const reservationsReady = useRef(false);

  const poll = useCallback(() => {
    fetch("/api/admin/commandes")
      .then((r) => r.json())
      .then((data: Commande[]) => {
        const list = Array.isArray(data) ? data : [];
        const newOnes = list.filter((c) => !knownCommandeIds.current.has(c.id));
        list.forEach((c) => knownCommandeIds.current.add(c.id));
        if (newOnes.length > 0 && commandesReady.current) {
          playCommandeAlarm();
          showNotification("Nouvelle commande", {
            body: `${newOnes.length} nouvelle(s) commande(s) à traiter.`,
          });
        }
        commandesReady.current = true;
      })
      .catch(() => {});

    fetch("/api/admin/appels")
      .then((r) => r.json())
      .then((data: Appel[]) => {
        const list = Array.isArray(data) ? data : [];
        const newAppels = list.filter((a) => !knownAppelIds.current.has(a.id));
        list.forEach((a) => knownAppelIds.current.add(a.id));
        if (newAppels.length > 0 && appelsReady.current) {
          const hasServeur = newAppels.some((a) => a.type === "serveur");
          const hasCharbon = newAppels.some((a) => a.type === "charbon");
          if (hasCharbon) {
            playAppelCharbonAlarm();
            showNotification("Demande charbon", {
              body: `${newAppels.filter((a) => a.type === "charbon").length} demande(s) de charbon`,
            });
          }
          if (hasServeur) {
            playAppelServeurAlarm();
            showNotification("Appel serveur", {
              body: `${newAppels.filter((a) => a.type === "serveur").length} appel(s) serveur`,
            });
          }
        }
        appelsReady.current = true;
      })
      .catch(() => {});

    fetch("/api/admin/reservations")
      .then((r) => r.json())
      .then((data: Reservation[]) => {
        const list = Array.isArray(data) ? data : [];
        const newOnes = list.filter((r) => !knownReservationIds.current.has(r.id));
        list.forEach((r) => knownReservationIds.current.add(r.id));
        if (newOnes.length > 0 && reservationsReady.current) {
          playReservationAlarm();
          showNotification("Nouvelle réservation", {
            body: `${newOnes.length} nouvelle(s) réservation(s) à traiter.`,
          });
        }
        reservationsReady.current = true;
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    requestNotificationPermission();
    poll();
    const t = setInterval(poll, POLL_MS);
    return () => clearInterval(t);
  }, [poll]);

  return null;
}
