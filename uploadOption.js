const accessKey = 'Z5eVKI63cMYXboRx19rI2SmPQiQWD0i3kFMlC6GR'; // 填写七牛网的accessKey
const secretKey = 'ry4Si2FO58PdbcZkr2coxm0xERHyV6XN7vULEqUu'; // 填写七牛网的secretKey
const bucket = 'hello'; // 填写七牛网文件所在的镜像
const domin = 'http://upload.qiniup.com'; // 上传地址
const viewPath = 'http://pjnxk0pmy.bkt.clouddn.com/'; // 图片上传后的静态引用路径前缀

const options = {
    accessKey: accessKey,
    secretKey: secretKey,
    bucket: bucket,
    domin: domin,
    delete: false// （每次上传，如果你要删除同名文件就改为true）
};

module.exports = {
    qnOption: options,
    viewPath: viewPath
};
