from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalogos', '0004_personaltaquilla'),
    ]

    operations = [
        migrations.AddField(
            model_name='personaltaquilla',
            name='sexo',
            field=models.CharField(default='', max_length=1),
            preserve_default=False,
        ),
    ]
