import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  HANDLE_MAX_LENGTH,
  HANDLE_MIN_LENGTH,
  HANDLE_PATTERN,
  type HandleFormRequest,
} from "@nila/types/schemas/handle.schema";

const HANDLE_REGEX = new RegExp(HANDLE_PATTERN);

export function useHandleForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<HandleFormRequest>({
    mode: "onChange",
    defaultValues: {
      handle: "",
    },
  });

  useEffect(() => {
    register("handle", {
      validate: (value: string) => {
        if (value.length > HANDLE_MAX_LENGTH) {
          return `사용자 이름은 ${HANDLE_MAX_LENGTH}자 이하로 입력해주세요`;
        }

        if (!HANDLE_REGEX.test(value)) {
          return "사용자 이름은 영문 소문자, 숫자, 점(.), 밑줄(_)만 사용할 수 있어요";
        }

        if (value.length < HANDLE_MIN_LENGTH) {
          return `사용자 이름은 ${HANDLE_MIN_LENGTH}자 이상이어야 해요`;
        }

        return true;
      },
    });
  }, [register]);

  const value = watch("handle") ?? "";
  const errorMessage = errors.handle?.message;
  const countText = `${value.length}/${HANDLE_MAX_LENGTH}`;
  const inputState = errorMessage ? "error" : "default";
  const isSubmitDisabled = !isValid;

  const onChangeValue = (nextValue: string) => {
    setValue("handle", nextValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit = handleSubmit((_data: HandleFormRequest) => {
    // TODO: 로직 구현 예정
  });

  return {
    value,
    countText,
    inputMaxLength: HANDLE_MAX_LENGTH,
    errorMessage,
    inputState,
    isSubmitDisabled,
    onChangeValue,
    onSubmit,
  } as const;
}
