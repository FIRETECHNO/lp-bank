export default defineNuxtRouteMiddleware(async (to, from) => {
  const lessonId = to.params._id as string;

  const authStore = useAuth();
  const lessonStore = useLesson();

  try {
    if (authStore.role === 'teacher') {
      setPageLayout('teacher-lesson');
    } else {
      setPageLayout('default');
    }

    await lessonStore.getLessonById(lessonId);

    const lesson = lessonStore.currentLesson.value;

    const hasAccess = authStore.user?._id === lesson?.student || authStore.user?._id === lesson?.teacher;

    if (hasAccess) {
      return true;
    } else {
      if (process.client) {
        useNuxtApp().$toast.warning("Вы не имеете доступ к этому уроку!");
      }
      return navigateTo('/');
    }
  } catch (error) {
    console.error("Error in lesson access middleware:", error);
    if (process.client) {
      useNuxtApp().$toast.error("Не удалось проверить доступ к уроку.");
    }
    return navigateTo('/');
  }
});
