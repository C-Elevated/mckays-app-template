import { create } from "zustand"

interface UserMessageIdStore {
  userMessageIdFromServer: string | null
  setUserMessageIdFromServer: (id: string | null) => void
}

export const useUserMessageId = create<UserMessageIdStore>((set) => ({
  userMessageIdFromServer: null,
  setUserMessageIdFromServer: (id) => set({ userMessageIdFromServer: id })
})) 