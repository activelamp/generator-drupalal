var generators = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    glob = require('glob'),
    fs = require('fs-extra'),
    changeCase = require('change-case'),
    path = require('path'),
    replace = require('replace');

module.exports = generators.Base.extend({

  askForProjectName: function() {
    var done = this.async();

    // have Yeoman greet the user
    this.log(yosay("Hello, you're about to " + chalk.red("setup a new Drupal site.") + "  First answer some simple questions."));

    var prompts = [{
      name: 'siteName',
      message: 'What is the short name for the site?',
      default: this.appname.replace(" ", "-")
    },
    {
      name: 'profileName',
      message: 'Would you like to name the profile?',
    },
    {
      name: 'profileMachineName',
      message: 'What should the profile machine name be?',
      default: function(props) {
        return changeCase.snakeCase(props.profileName)
      }
    },
    {
      name: 'profileDescription',
      message: 'Describe what this profile does.'
    },
    {
      name: 'drupalUrl',
      message: 'What hostname should the dev environment setup?',
      default: this.appname.replace(" ", "-") + ".dev"
    },
    {
      type: 'list',
      name: 'drupalVersion',
      message: 'Would version of Drupal are you developing on?',
      choices: ['7.x (WIP)', '8.0.x']
    }
    ];

    this.prompt(prompts, function(props) {
      this.siteName = props.siteName;
      this.profileName = props.profileName;
      this.profileMachineName = props.profileMachineName;
      this.profileDescription = props.profileDescription;
      this.drupalUrl = props.drupalUrl;
      this.drupalVersion = props.drupalVersion;

      done();
    }.bind(this));
  },

  writing: {
    app: function() {
      var self = this;
      var files = glob.sync(self.templatePath() + '/**/*');
      var drushVersion = "7.1.0";
      var drushCore = "7.x";
      var drupalCore = "7.42";

      files.forEach(function(file) {
        if (fs.lstatSync(file).isDirectory()) {
          // Don't try to copy a directory, they get created automatically.
          return;
        }

        var fileName = file.replace(self.templatePath() + '/', '');
        var newFileName = fileName
          .replace(/custom_profile/g, self.profileMachineName)
          .replace(/APP-NAME/g, self.siteName);;

        var dir = path.dirname(newFileName);
        var baseName = path.basename(newFileName);
        var extension = path.extname(baseName);

        if (self.drupalVersion == "8.0.x") {
          drushCore = "8.x";
          drupalCore = "8.0.1";
          drushVersion = "8.0.1";
          if (extension === '.info' || extension === '.d7') return;
        }
        else {
          if (fileName === 'drupal/config/sync/README.md') return;
          if (extension === '.yml' || extension === '.d8') return;
        }

        if (extension === '.d8' || extension === '.d7') {
          baseName = baseName.substr(0, baseName.length - 3)
        }

        if (extension !== '.scss') {
          // If not a SCSS file, convert the prefix of the underscore to a dot.
          baseName = baseName.replace(/^_/g, '.');
        }

        newFileName = dir ? dir + '/' + baseName : baseName;

        if (extension === '.png' || extension === '.jpg') {
          self.fs.copy(self.templatePath(fileName), self.destinationPath(newFileName));
        }
        else {
          var contents = self.fs.read(self.templatePath(fileName));
          var newContents = contents
            .replace(/APP-NAME/g, changeCase.paramCase(self.siteName))
            .replace(/APP_NAME/g, changeCase.snakeCase(self.siteName))
            .replace(/PROFILE_NAME/g, self.profileName)
            .replace(/PROFILE_DESCRIPTION/g, self.profileDescription)
            .replace(/DEV_URL/g, self.drupalUrl)
            .replace(/DRUSH_VERSION/g, drushVersion)
            .replace(/DRUSH_CORE/g, drushCore)
            .replace(/DRUPAL_CORE/g, drupalCore)
            .replace(/custom_profile/g, self.profileMachineName);

          if (fileName === 'bin/drush' && self.drupalVersion != "8.0.x") {
            newContents = newContents
              .replace(/drush.launcher/g, 'drush');
          }

          self.fs.write(newFileName, newContents);
        }

      });

      // Copy the .gitignore
      // self.fs.copy(self.templatePath('.gitignore'), self.destinationPath('.gitignore'));
    }
  },

  install: {
    client: function() {
      if (this.options['skip-install']) {
        // @todo: Improve message.
        this.log('Skip install');
        return;
      }

      this.log('Make bin directory executable');
      this.spawnCommand('chmod', ['+x', 'bin/install.sh']);
      this.spawnCommand('chmod', ['+x', 'bin/rebuild.sh']);
      this.spawnCommand('chmod', ['+x', 'bin/drush']);

      this.log('Run `make all`');
      this.spawnCommand('make', ['all']);

    }
  }
  
});
