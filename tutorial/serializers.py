from rest_framework import serializers

from .models import Level, Challenge

class LevelSerializer(serializers.ModelSerializer):
    challenges = serializers.PrimaryKeyRelatedField(many=True)

    class Meta:
        model = Level
        fields = ('id', 'number', 'title', 'challenges')

class ChallengeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Challenge
        fields = ('id', 'level', 'number', 'title', 'description', 'output_is_error', 'output_condition')
