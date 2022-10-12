const fs = require('fs');
module.exports = api => {
  // 正常来讲，非vue项目是不适合使用vue-cli插件做初始化的
  // 因为它内置并固定运行@vue/cli-service插件，用于生成基础的vue项目文件和配置。
  // 这里强行使用vue-cli的方式初始化一个CLI插件项目，就需要清除@vue/cli-service做的修改
  // 有个小瑕疵，create过程中安装依赖的环节取消不掉

  // 清除@vue/cli-service生成的默认文件
  api.render(files => {
    for (const key in files) {
      delete files[key];
    }
  });

  // 使用自定义的目录文件
  api.render('./template');

  // 清除@vue/cli-service设置在package.json的与CLI插件开发无关的非必要选项
  api.onCreateComplete(() => {
    // 读package.json清除无关的属性
    let config, configPath;
    const pkgPath = api.resolve('./package.json');
    if (fs.existsSync(pkgPath)) {
      configPath = pkgPath;
      config = JSON.parse(fs.readFileSync(pkgPath, { encoding: 'utf8' }));
      console.log('config', config);
      delete config.dependencies;
      delete config.browserslist;
      delete config.devDependencies;
      config.main = "index.js"
      config.scripts = {
        test: 'echo "Error: no test specified" && exit 1'
      };
      console.log('config2', config);
    }
    if (configPath) {
      const moduleExports = configPath !== pkgPath ? 'module.exports = ' : '';
      fs.writeFileSync(
        configPath,
        `${moduleExports}${JSON.stringify(config, null, 2)}`,
        { encoding: 'utf8' }
      );
    }
  });
};
