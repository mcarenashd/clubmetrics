import { Club } from '@/types/club'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function getAnonymousLabel(index: number): string {
  if (index < 26) return `Club ${LETTERS[index]}`
  return `Club ${LETTERS[Math.floor(index / 26) - 1]}${LETTERS[index % 26]}`
}

export function anonymizeClubsForDisplay(
  clubs: Club[],
  myClubId: string
): { label: string; isOwn: boolean; club: Club }[] {
  let letterIndex = 0
  return clubs.map(club => {
    if (club.id_club === myClubId) {
      return { label: 'Tu club ★', isOwn: true, club }
    }
    const label = getAnonymousLabel(letterIndex)
    letterIndex++
    return { label, isOwn: false, club }
  })
}

export function getAnonymousId(club: Club, myClubId: string): string {
  if (club.id_club === myClubId) return 'Tu club'
  return club.id_club
}
