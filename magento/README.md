






Error en los estaticos:

```
Open up app/etc/di.xml and find the virtualType name="developerMaterialization" section. In that section you'll find an item name="view_preprocessed" that needs to be modified or deleted. You can modify it by changing the contents from Magento\Framework\App\View\Asset\MaterializationStrategy\Symlink to Magento\Framework\App\View\Asset\MaterializationStrategy\Copy

php bin/magento cache:clean

php bin/magento cache:flush

remove everything(not .htacess) from pub/static, var, generated

php bin/magento setup:upgrade

php bin/magento setup:static-content:deploy -f

php bin/magento setup:static-content:deploy es_PE --exclude-theme Magento/luma --exclude-theme Magento/blank -f
```
Ref:
https://magento.stackexchange.com/questions/64802/magento-2-404-error-for-scripts-and-css
Ref:
https://magento.stackexchange.com/questions/200525/unable-to-retrieve-deployment-version-of-static-files-from-the-file-system/259932#259932?newreg=63f8adce8d8a43cfadff0193e71014a6




Para listar el estado de los plugins usar:
```
bin/magento module:status
```
Para habilitar o deshabilitar un plugin usar:
```
bin/magento module:enable [-c|--clear-static-content] [-f|--force] [--all] <module-list>
bin/magento module:disable [-c|--clear-static-content] [-f|--force] [--all] <module-list>
```

Ref:
https://devdocs.magento.com/guides/v2.4/install-gde/install/cli/install-cli-subcommands-enable.html
