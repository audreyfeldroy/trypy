from django.db import models

class Level(models.Model):
    number = models.IntegerField()
    title = models.CharField(max_length=255)

    def __unicode__(self):
        return self.title


class Challenge(models.Model):
    level = models.ForeignKey(Level)
    number = models.IntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField()

    output_is_error = models.BooleanField(default=False)
    output_condition = models.CharField(max_length=255, help_text="Regex")

    def __unicode__(self):
        return "Level %i, challenge %i: %s" % (self.level.number, self.number, self.title)
