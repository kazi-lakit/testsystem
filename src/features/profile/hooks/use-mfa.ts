import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useGlobalMutation } from 'state/query-client/hooks';
import {
  generateOTP,
  verifyOTP,
  getSetUpTotp,
  resendOtp,
  getMfaTemplate,
  disableUserMfa,
} from '../services/mfa.services';
import { useToast } from 'hooks/use-toast';
import { SetUpTotp, GenerateOTPPayload } from '../types/mfa.types';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to generate a One-Time Password (OTP) for a given user.
 *
 * This hook utilizes a global mutation to call the OTP generation API.
 * It returns mutation utilities such as `mutate`, `mutateAsync`, `isLoading`, etc.
 *
 * @returns {UseMutationResult} A mutation object for triggering the OTP generation.
 *
 * @example
 * const { mutate } = useGenerateOTP();
 * mutate({ userId: 'user-id-123', mfaType: 1 }); // Triggers OTP generation for the given user ID and MFA type
 */
export const useGenerateOTP = () => {
  return useGlobalMutation({
    mutationKey: ['generateOTP'],
    mutationFn: (payload: GenerateOTPPayload) => generateOTP(payload),
  });
};

/**
 * Custom hook to verify the OTP (One-Time Password) entered by the user.
 *
 * This hook uses a global mutation to call the OTP verification API.
 * It returns mutation utilities such as `mutate`, `mutateAsync`, `isLoading`, etc.
 *
 * @returns {UseMutationResult} A mutation object for verifying the OTP.
 *
 * @example
 * const { mutate } = useVerifyOTP();
 * mutate({ verificationCode: '12345', mfaId: 'abc123', authType: 1 });
 */
export const useVerifyOTP = () => {
  const queryClient = useQueryClient();

  return useGlobalMutation({
    mutationKey: ['verifyOTP'],
    mutationFn: verifyOTP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAccount'] });
    },
  });
};

/**
 * Custom hook to initialize TOTP (Time-based One-Time Password) setup for a user.
 *
 * This hook calls the `getSetUpTotp` API, which returns the necessary information
 * (e.g., QR code, secret) to configure a TOTP authenticator app.
 *
 * @returns {UseMutationResult} A mutation object that includes `mutate`, `mutateAsync`, `isLoading`, etc.
 *
 * @example
 * const { mutate } = useGetSetUpTotp();
 * mutate({ userId: 'user-123', userMfaType: 2 });
 */
export const useGetSetUpTotp = () => {
  return useMutation({
    mutationFn: (queryParams: SetUpTotp) =>
      getSetUpTotp({ queryKey: ['getSetUpTotp', queryParams] }),
  });
};

/**
 * Custom hook to resend the OTP (One-Time Password) to the user's email.
 *
 * This hook uses a global mutation to trigger the resend OTP process.
 * Upon success, it displays a success toast notification confirming the OTP has been resent.
 * If the request fails, it shows an error toast with a relevant message.
 *
 * @returns {UseMutationResult} A mutation object that includes mutation methods like `mutate`, `isLoading`, `isError`, etc.
 *
 * @example
 * const { mutate } = useResendOtp();
 * mutate(); // Trigger the OTP resend process
 */
export const useResendOtp = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useGlobalMutation({
    mutationKey: ['resendOtp'],
    mutationFn: resendOtp,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: t('OTP_RESENT_SUCCESSFULLY'),
        description: t('NEW_OTP_HAS_BEEN_SENT_EMAIL'),
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: t('FAILED_TO_RESEND_OTP'),
        description: error?.error?.message ?? t('ERROR_OCCURRED_RESENDING_OTP'),
      });
    },
  });
};

/**
 * Custom hook to fetch the MFA template configuration.
 *
 * This hook uses a query to fetch the MFA template configuration from the server.
 * It automatically handles caching and revalidation of the data.
 *
 * @returns {UseQueryResult} A query object that includes the data, loading state, and error state.
 *
 * @example
 * const { data, isLoading } = useGetMfaTemplate();
 * if (!isLoading) {
 *   console.log(data); // MFA template configuration
 * }
 */
export const useGetMfaTemplate = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['mfaTemplate'],
    queryFn: getMfaTemplate,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['getAccount'] });
    }
  }, [query.isSuccess, queryClient]);

  return query;
};

/**
 * Custom hook to disable Multi-Factor Authentication (MFA) for a user.
 *
 * This hook uses a global mutation to disable MFA for the user.
 *
 * @returns {UseMutationResult} A mutation object that includes mutation methods like `mutate`, `isLoading`, `isError`, etc.
 *
 * @example
 * const { mutate } = useDisableUserMfa();
 * mutate('user-123'); // Disable MFA for the user with ID 'user-123'
 */
export const useDisableUserMfa = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useGlobalMutation({
    mutationKey: ['disableUserMfa'],
    mutationFn: (userId: string) => disableUserMfa(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAccount'] });
      toast({
        variant: 'success',
        title: t('MFA_DISABLED_SUCCESSFULLY'),
        description: t('MULTI_FACTOR_AUTH_DISABLED_SUCCESSFULLY'),
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: t('FAILED_TO_DISABLE_MFA'),
        description: error?.error?.message ?? t('ERROR_OCCURRED_WHILE_DISABLING_MFA'),
      });
    },
  });
};
