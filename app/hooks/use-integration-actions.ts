"use client";

import { useClerk, useReverification, useUser } from "@clerk/nextjs";

type Provider = string;

function isReverificationCancelled(err: unknown) {
  const maybeClerkError = err as {
    clerkError?: boolean;
    code?: string;
  };

  if (maybeClerkError?.clerkError !== true) return false;

  return (
    maybeClerkError.code === "reverification_cancelled" ||
    maybeClerkError.code === "reverification_cancelled_error"
  );
}

export function useIntegrationActions() {
  const clerk = useClerk();
  const { user, isLoaded: userLoaded } = useUser();

  const destroyExternalAccount = useReverification(
    async (externalAccount: { destroy: () => Promise<unknown> }) => {
      await externalAccount.destroy();
    },
  );

  const connect = () => {
    // Current design decision: always use Clerk's UserProfile modal.
    clerk.openUserProfile();
  };

  const disconnect = async (provider: Provider) => {
    if (!userLoaded) {
      throw new Error("Usuario no cargado");
    }

    const externalAccount = user?.externalAccounts?.find(
      (account) => account.provider === provider,
    );

    if (!externalAccount) {
      throw new Error(
        `No se encontró una cuenta externa para el proveedor ${provider}`,
      );
    }

    try {
      await destroyExternalAccount(externalAccount);
    } catch (err) {
      if (isReverificationCancelled(err)) return { cancelled: true as const };
      throw err;
    }

    return { cancelled: false as const };
  };

  const isConnected = (provider: Provider) => {
    return (
      user?.externalAccounts?.some((account) => account.provider === provider) ??
      false
    );
  };

  return {
    connect,
    disconnect,
    isConnected,
    user,
    userLoaded,
  };
}
