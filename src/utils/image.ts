/**
 * 图片url
 */
export const getImageUrl = () => {
  if(import.meta.env.DEV) {
    // 如果是在开发环境
    return 'http://172.100.3.144:9080/file/download';
  } else {
    return `${window.location.origin}/file/download`;
  }
};
